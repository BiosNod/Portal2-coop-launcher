const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const gui = require('nw.gui');
const processWindows = require("node-process-windows");
const activeWindow = require('active-window');

// Пути к играм
const MAIN_PATH = 'E:\\Sandbox\\alex\\Gaming\\drive\\F\\installed\\3d\\';
const PORTAL_PRELUDE_PATH = MAIN_PATH + 'Portal + Portal Prelude\\';
const PORTAL2_PATH = MAIN_PATH + 'Portal 2\\';
const PORTAL2_REVOLUTION_PATH = MAIN_PATH + 'Portal Revolution 1.6.1\\';

let isCooperativeMode = false;
const { width: screenWidth, height: screenHeight } = getScreenResolution();

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

// Комментарии для разработчиков
// Запуск сервера в режиме коопа с картой
// portal2.exe -console +sv_cheats 1 +mp_wait_for_other_player_notconnecting_timeout 600 +mp_wait_for_other_player_timeout 120 +map mp_coop_start

// Подключение к серверу
// portal2.exe -console +connect 94.180.234.121

// Запуск мода игры
// portal2.exe -game portal_stories

// Запуск игры без модов
// portal2.exe
// Полный код:
// execute('portal2.exe', [], 'F:\\installed\\3d\\Portal 2')

// Запуск кастомной карты
// portal2.exe -console +map mymaps_wust1
// Полный код:
// execute('portal2.exe', [' -console', '+map mymaps_wust1'], 'F:\\installed\\3d\\Portal 2')

// Также к любым portal2.exe (кроме мода revolution)
// нужно будет добавить опцию стим: -steam
// и разрешение текущего экрана: -w 1920 -h 1080
// (т.к. некоторые версии portal при запуске ставят очень низкое разрешение)
// Пример установки FullHD:
// portal2.exe -steam -w 1920 -h 1080

// Получение разрешения экрана
function getScreenResolution() {
    const gui = require('nw.gui');
    gui.Screen.Init();
    let screens = gui.Screen.screens;
    const primaryScreen = screens[0];
    console.log('primaryScreen', primaryScreen);
    return {
        // Math.floor to fix 2560.5 -> 2560
        width: Math.floor(primaryScreen.bounds.width * primaryScreen.scaleFactor),
        height: Math.floor(primaryScreen.bounds.height * primaryScreen.scaleFactor)
    };
}

/**
 * Устанавливает фокус на окно процесса с проверкой его активности.
 * @param {string} processName - Имя исполняемого файла процесса (например, "portal2.exe").
 * @param {number} maxAttempts - Максимальное количество попыток.
 * @param {number} delay - Задержка между попытками (в миллисекундах).
 */
async function focusWindowWithValidation(processName, maxAttempts = 2, delay = 1000) {
    let msg = `Trying to set focus to process: ${processName}`
    console.info(msg)
    toastr.info(msg);
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

// Функция для запуска игры с указанными параметрами.
function startMod(mod) {
    const fullPath = path.join(mod.path, mod.fileName);

    if (!fs.existsSync(fullPath)) {
        let msg = `File not found: ${fullPath}`;
        toastr.error(msg);
        console.error(msg);
        return;
    }

    const resolution = getScreenResolution();
    const resolutionParams = ['-w', `${resolution.width}`, '-h', `${resolution.height}`];
    const gameParams = [...mod.params, ...resolutionParams];

    gui.Window.get().minimize();

    /* let cmd =
        `cd /d "${mod.path}"
         start "" "${mod.fileName}" ${gameParams.join(' ')}
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

    executeCommand(cmd)
}

function getProcessNameFromCmd(cmd) {
    // Регулярное выражение для поиска имени файла с расширением .exe
    const match = cmd.match(/([^\\\/:"*?<>|]+\.exe)/i);
    if (match) {
        // Возвращаем имя файла без расширения
        return path.basename(match[0], path.extname(match[0]));
    }
    throw new Error('Executable file name not found in command');
}

// Функция для выполнения команды
const executeCommand = (cmd) => {
    console.log(`Executing: ${cmd}`);

    new Promise((resolve, reject) => {
        child_process.exec(cmd, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    }).then(() => {
        console.log('Game launched successfully');
        // Остаётся задать фокус окну, иначе в случае portal prelude будет чёрный экран после запуска
        // который исчезает только если переключиться на alt+tab или win+tab на другое окно и потом
        // снова на окно игры
        setTimeout(() => {
            const processName = getProcessNameFromCmd(cmd);
            focusWindowWithValidation(processName)
                .then((success) => {
                    if (success) {
                        let msg = "Focus successfully set and validated."
                        toastr.success(msg)
                        console.log(msg);
                    } else {
                        let msg = "Failed to set and validate focus."
                        toastr.success(msg)
                        console.error(msg);
                    }

                    // Лаунчер больше не нужен
                    process.exit(0);
                })
                .catch(err => {
                    let msg = "Error during focus validation:"
                    toastr.error(msg + err)
                    console.error(msg, err);
                });
        }, 1000); // Задержка запуска функции на 1 секунду
    })
    .catch(err => {
        let msg = `Failed to execute: ${err.message}`
        console.error(msg)
        toastr.error(msg);
    });
};

let currentLanguage = 'en'; // По умолчанию русский язык

function translateUI(lang) {
    $('[data-translate]').each(function() {
        const key = $(this).data('translate');
        $(this).text(translations[lang][key]);
    });

    // Обновление текста в полях команд
    updateCreateServerCommandPreview();
    updateConnectionCommandPreview();
}

// Рендер карточек игр
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
        });

        $('#gameCards').append(card);
    });
};

// Сброс кооперативного режима
const resetCoopMode = () => {
    $('.coop-mode-select, .server-creation, .connection').addClass('d-none');
    $('.game-grid').removeClass('d-none');
};

// Обновление предпросмотра команды для создания сервера
const updateCreateServerCommandPreview = () => {
    const chapter = $('#chapterSelect').val();
    const map = $('#mapSelect').val();
    const timeout = $('#timeoutInput').val() || '60';

    if (chapter && map && map !== "") {
        const cmd = `"${PORTAL2_PATH}portal2.exe" -steam -w ${screenWidth} -h ${screenHeight} -console +sv_cheats 1 +mp_wait_for_other_player_timeout ${timeout} +map ${map}`;
        $('#create-server-command-text').text(cmd);
    } else {
        $('#create-server-command-text').text(translations[currentLanguage].pleaseSelectChapterAndMap);
    }
};

// Обновление предпросмотра команды для подключения
const updateConnectionCommandPreview = () => {
    const ip = $('#ipInput').val().trim();
    if (ip) {
        const cmd = `"${PORTAL2_PATH}portal2.exe" -steam -w ${screenWidth} -h ${screenHeight} -console +connect ${ip}`;
        $('#connection-command-text').text(cmd);
    } else {
        $('#connection-command-text').text(translations[currentLanguage].pleaseEnterIP);
    }
};

function translateChapterAndMapNames() {
    const chapterSelect = $('#chapterSelect');
    const mapSelect = $('#mapSelect');

    // Очищаем и добавляем placeholder для глав
    chapterSelect.empty().append(`<option value="" selected>${translations[currentLanguage].selectChapter}</option>`);

    // Очищаем и добавляем placeholder для карт
    mapSelect.empty().append(`<option value="" selected>${translations[currentLanguage].selectMap}</option>`);

    // Заполняем главы
    Object.entries(coopMainChapters).forEach(([chapter, maps]) => {
        if (chapter) { // Проверяем, что глава существует
            const translatedChapter = chapter.split(' | ')[currentLanguage === 'en' ? 0 : 1];
            chapterSelect.append(`<option value="${chapter}">${translatedChapter}</option>`);
        }
    });

    // Обработчик изменения выбора главы
    chapterSelect.change(function () {
        const selectedChapter = $(this).val();
        mapSelect.empty().append(`<option value="" selected>${translations[currentLanguage].selectMap}</option>`);

        if (selectedChapter && coopMainChapters[selectedChapter]) {
            coopMainChapters[selectedChapter].forEach(map => {
                if (map) { // Проверяем, что карта существует
                    const [namePart, mapIdentifier] = map.split(' - ');
                    const [englishName, russianName] = namePart.split(' | ');

                    // Используем переведённое название карты
                    const translatedMap = currentLanguage === 'en' ? englishName : russianName;

                    // Добавляем карту с переведённым названием и идентификатором
                    mapSelect.append(`<option value="${mapIdentifier}">${translatedMap}</option>`);
                }
            });
        }
        updateCreateServerCommandPreview();
    });

    // Обработчик изменения выбора карты
    mapSelect.change(updateCreateServerCommandPreview);
}

$(document).ready(() => {
    // Инициализация перевода
    translateUI(currentLanguage);

    $('.language-select').change(function() {
        currentLanguage = $(this).val();
        translateUI(currentLanguage);

        // Обновляем текст кнопки в зависимости от состояния
        if (isCooperativeMode) {
            $('.toggle-coop').text(translations[currentLanguage].singleMode);
        } else {
            $('.toggle-coop').text(translations[currentLanguage].coopMode);
        }

        // Обновляем другие элементы интерфейса
        translateChapterAndMapNames();
        updateCreateServerCommandPreview();
        updateConnectionCommandPreview();
    });

    $('.poster-style').change(function() {
        renderGameCards($(this).val());
    });

    // Обработчик кнопки "Кооперативный режим"
    $('.toggle-coop').click(function() {
        if (isCooperativeMode) {
            resetCoopMode();
            $(this).text(translations[currentLanguage].coopMode); // Используем перевод
            isCooperativeMode = false;
        } else {
            $('.game-grid').addClass('d-none');
            $('.coop-mode-select').removeClass('d-none');
            $(this).text(translations[currentLanguage].singleMode); // Используем перевод
            isCooperativeMode = true;
        }
    });

    // Обработчик выбора "Создать сервер"
    $('#createServerCard').click(function() {
        $('.coop-mode-select').addClass('d-none');
        $('.server-creation').removeClass('d-none');
        // Заполнение глав и карт
        translateChapterAndMapNames();
    });

    // Обработчик выбора "Подключиться к серверу"
    $('#connectServerCard').click(function() {
        $('.coop-mode-select').addClass('d-none');
        $('.connection').removeClass('d-none');
    });

    // Обработчик кнопки "Назад"
    $('.back-btn').click(function() {
        $('.server-creation, .connection').addClass('d-none');
        $('.coop-mode-select').removeClass('d-none');
    });

    // Обработчик кнопки "Запустить сервер"
    $('.start-server').click(function() {
        const chapter = $('#chapterSelect').val();
        const map = $('#mapSelect').val();
        const timeout = $('#timeoutInput').val() || '60';

        if (chapter && map) {
            const cmd = `"${PORTAL2_PATH}portal2.exe" -steam -w ${screenWidth} -h ${screenHeight} -console +sv_cheats 1 +mp_wait_for_other_player_notconnecting_timeout ${timeout}  +map ${map}`;
            executeCommand(cmd);
        } else {
            toastr.error(translations[currentLanguage].pleaseSelectChapterAndMap);
        }
    });

// Обработчик кнопки "Подключиться к серверу"
    $('.connect-server').click(function() {
        const ip = $('#ipInput').val().trim();
        if (ip) {
            const cmd = `"${PORTAL2_PATH}portal2.exe" -steam -w ${screenWidth} -h ${screenHeight} -console +connect ${ip}`;
            executeCommand(cmd);
        } else {
            toastr.error(translations[currentLanguage].pleaseEnterIP);
        }
    });

    // Инициализация
    renderGameCards();
    $('#timeoutInput').on('input', updateCreateServerCommandPreview);
    $('#ipInput').on('input', updateConnectionCommandPreview);
});