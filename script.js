const fs = require('fs')
const path = require('path')
const exec = require('child_process').execFile

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
 * Выполняет файл с указанными параметрами.
 * @param {string} fileName Имя файла для запуска.
 * @param {string[]} params Список параметров командной строки.
 * @param {string} cwd Рабочая директория.
 */
function execute(fileName, params, cwd) {
    return new Promise((resolve, reject) => {
        exec(fileName, params, { cwd }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
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
                    toastr.error('Path not found for the selected game');
                    return;
                }

                const fullPath = path.join(mod.path, mod.fileName);

                if (!fs.existsSync(fullPath)) {
                    toastr.error(`File not found: ${fullPath}`);
                    return;
                }

                const resolution = getScreenResolution();
                const resolutionParams = ['-w', `${resolution.width}`, '-h', `${resolution.height}`];
                const gameParams = [...mod.params, ...resolutionParams];

                execute(fullPath, gameParams, mod.path)
                    .then(() => {
                        console.log('Game launched successfully');
                        process.exit(0); // Завершение приложения
                    })
                    .catch(err => {
                        toastr.error(`Failed to execute: ${err.message}`);
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