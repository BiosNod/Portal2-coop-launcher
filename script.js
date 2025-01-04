const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const gui = require('nw.gui')
const processWindows = require("node-process-windows")
const activeWindow = require('active-window');

// Пути к играм
const MAIN_PATH = 'D:\\Sandbox\\alex\\Gaming\\drive\\D\\installed\\'
const PORTAL_PRELUDE_PATH = MAIN_PATH + 'Portal + Portal Prelude NEW RUS\\'
const PORTAL2_PATH = MAIN_PATH + 'Portal 2 NEW RUS\\'
const PORTAL2_REVOLUTION_PATH = MAIN_PATH + 'Portal Revolution NEW RUS\\'

// Коллекция игр
let mods = {
    'portal': {
        image: 'portal.png',
        fileName: 'hl2.exe',
        params: ['-steam', '-game', 'portal'],
        path: PORTAL_PRELUDE_PATH
    },

    'prelude': {
        image: 'portal_prelude.png',
        fileName: 'hl2.exe',
        params: ['-steam', '-game', 'prelude'],
        path: PORTAL_PRELUDE_PATH
    },

    'portal2': {
        image: 'portal2.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game', 'portal2'],
        path: PORTAL2_PATH
    },

    'portal_stories': {
        image: 'portal2_storiesmel.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game', 'portal_stories'],
        path: PORTAL2_PATH
    },

    'TWTM': {
        image: 'portal2_twtm.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game', 'TWTM'],
        path: PORTAL2_PATH
    },

    'aperturetag': {
        image: 'portal2_aperturetag.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game', 'aperturetag'],
        path: PORTAL2_PATH
    },

    'portalreloaded': {
        image: 'portal2_reloaded.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game', 'portalreloaded'],
        path: PORTAL2_PATH
    },

    'portalrevolution': {
        image: 'portal2_revolution.png',
        fileName: 'revolution.exe',
        params: [],
        path: PORTAL2_REVOLUTION_PATH + 'bin\\win64\\'
    }
}

// Запуск сервера в режиме коопа с картой
// portal2.exe -console +sv_cheats 1 +mp_wait_for_other_player_notconnecting_timeout 600 +mp_wait_for_other_player_timeout 120 +map mp_coop_start

// Подключение к серверу
// portal2.exe -console +connect 94.180.234.121

// Запуск мода игры
// portal2.exe -game portal_stories

// Запуск игры без модов
// portal2.exe
// Полный код:
// execute('portal2.exe', [], 'F:\\installed\\3d\\Portal 2 Mech')

// Запуск кастомной карты
// portal2.exe -console +map mymaps_wust1
// Полный код:
// execute('portal2.exe', [' -console', '+map mymaps_wust1'], 'F:\\installed\\3d\\Portal 2 Mech')

// Также к любым portal2.exe нужно будет добавить разрешение текущего экрана так: -w 1920 -h 1080
// (а лучше чтобы в интерфейсе была такая опция)
// и ещё -steam (кроме мода revolution)

// Получение разрешения экрана с использованием NW.js
function getScreenResolution() {
    const gui = require('nw.gui');
    gui.Screen.Init();
    let screens = gui.Screen.screens;
    const primaryScreen = screens[0];
    console.log('primaryScreen', primaryScreen);
    return {
        width: primaryScreen.bounds.width * primaryScreen.scaleFactor,
        height: primaryScreen.bounds.height * primaryScreen.scaleFactor
    };
}

/**
 * Устанавливает фокус на окно процесса с проверкой его активности.
 * @param {string} processName - Имя исполняемого файла процесса (например, "portal2.exe").
 * @param {number} maxAttempts - Максимальное количество попыток.
 * @param {number} delay - Задержка между попытками (в миллисекундах).
 */
async function focusWindowWithValidation(processName, maxAttempts = 2, delay = 1000) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.log(`Attempt ${attempt}: Setting focus to "${processName}"...`);
        const processes = await new Promise((resolve) =>
            processWindows.getProcesses((err, processList) => resolve(processList || []))
        );
        console.log('Filtering processes...')
        const targetProcesses = processes.filter(p => p.processName.indexOf(processName) >= 0);
        if (targetProcesses.length > 0) {
            console.log('Target process found:', targetProcesses)
            processWindows.focusWindow(targetProcesses[0]);
            console.log('Focused to:', targetProcesses[0])

            await new Promise((resolve) => setTimeout(resolve, delay)); // Ждём перед проверкой

            // Проверяем, стало ли окно активным
            console.log('Trying to get active windows...')

            // Получаем активное окно через active-window
            activeWindow.getActiveWindow((window) => {
                console.log('Active window found')
                console.log("App: " + window.app);
                console.log("Title: " + window.title);

                if (window && window.app)
                {
                    if (window.app === processName) {
                        console.log(`Window for process "${processName}" is now active`);
                        return true;
                    } else {
                        console.warn(`Window "${processName}" is not active yet.`);
                    }
                }
                else
                    console.warn('No any active window found')
            });
        } else {
            console.error(`Process "${processName}" not found.`);
        }

        // Если достигли последней попытки
        if (attempt === maxAttempts) {
            console.error(`Failed to set focus to "${processName}" after ${maxAttempts} attempts.`);
            return false;
        }

        await new Promise((resolve) => setTimeout(resolve, delay)); // Ждём перед следующей попыткой
    }
}

/**
 * Выполняет файл с указанными параметрами.
 */
function startMod(mod) {
    const fullPath = path.join(mod.path, mod.fileName);

    if (!fs.existsSync(fullPath)) {
        let msg = `File not found: ${fullPath}`
        toastr.error(msg);
        console.error(msg)
        return;
    }

    const resolution = getScreenResolution();
    const resolutionParams = ['-w', `${resolution.width}`, '-h', `${resolution.height}`];
    const gameParams = [...mod.params, ...resolutionParams];

   gui.Window.get().minimize()

   /* let cmd =
        `cd /d "${mod.path}"
        start "" "${mod.fileName}" "${gameParams.join(' ')}"
        del "%~f0"`
    let batPath = 'start.bat'
    fs.writeFileSync(batPath, cmd);
    child_process.exec(batPath, (err, data) => {
        console.log(err)
        console.log(data.toString());
    });*/

    //let cmd = `cmd /c start "" "${fullPath}" ${gameParams.join(' ')}`
    //let cmd = `"${fullPath}" ${gameParams.join(' ')}`
    let cmd = `start "" "${fullPath}" ${gameParams.join(' ')}`

    console.log(`Executing: ${cmd}`);

    return new Promise((resolve, reject) => {
        child_process.exec(cmd, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    })
}

$(document).ready(() => {
    const renderGameCards = (posterStyle = 'main') => {
        $('#gameCards').empty();

        Object.entries(mods).forEach(([key, mod]) => {
            const card = $(`
                <div class="game-card" style="background-image: url(/images/launcher/${posterStyle}/${mod.image})" alt="${key}">
                </div>
            `);

            card.click(() => {
                if (!mod.path) {
                    let msg = 'Path not found for the selected game'
                    toastr.error(msg);
                    console.error(msg)
                    return;
                }

                startMod(mod)
                    .then(() => {
                        console.log('Game launched successfully');
                        // Остаётся задать фокус окну, иначе в случае portal prelude будет чёрный экран после запуска
                        // который исчезает только если переключиться на alt+tab или win+tab на другое окно и потом
                        // снова на окно игры
                        setTimeout(() => {
                            const processName = path.basename(mod.fileName, path.extname(mod.fileName));
                            focusWindowWithValidation(processName)
                                .then((success) => {
                                    if (success) {
                                        console.log("Focus successfully set and validated.");
                                    } else {
                                        console.error("Failed to set and validate focus.");
                                    }

                                    // Лаунчер больше не нужен
                                    process.exit(0);
                                })
                                .catch(err => console.error("Error during focus validation:", err));
                        }, 1000); // Задержка запуска функции на 1 секунду
                    })
                    .catch(err => {
                        let msg = `Failed to execute: ${err.message}`
                        console.error(msg)
                        toastr.error(msg);
                    });
            });

            $('#gameCards').append(card);
        });
    };

    $('.poster-style').change(function() {
        renderGameCards($(this).val());
    });

    $('.toggle-coop').click(function() {
        $('.game-grid').toggleClass('d-none');
        $('.coop-settings').toggleClass('d-none');
    });

    renderGameCards();
});