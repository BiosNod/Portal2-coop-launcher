const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const gui = require('nw.gui');
const processWindows = require("node-process-windows");
const activeWindow = require('active-window');

const CONF_NAME = 'games.json'
// Пути для поиска games.json
const GAMES_CONFIG_PATHS = [
    path.join(path.dirname(process.execPath), CONF_NAME), // Рядом с исполняемым файлом
    path.join(process.cwd(), CONF_NAME) // В текущей рабочей папке
];

// Загрузка путей из games.json
let gamesConfig = {};
let configLoaded = false;

for (const configPath of GAMES_CONFIG_PATHS) {
    try {
        if (fs.existsSync(configPath)) {
            gamesConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            configLoaded = true;
            console.log(`Конфигурация загружена из: ${configPath}`);
            break; // Прерываем цикл, если файл найден
        }
    } catch (err) {
        const msg = `Ошибка при чтении файла games.json (${configPath}): ${err.message}`;
        toastr.error(msg);
        console.error(msg);
    }
}

if (!configLoaded) {
    const msg = translations[currentLanguage].gamesConfigNotFound;
    toastr.error(msg);
    console.error(msg);
}

// Пути к играм
const PORTAL_PRELUDE_PATH = gamesConfig.PORTAL_PRELUDE_PATH;
const PORTAL2_PATH = gamesConfig.PORTAL2_PATH;
const PORTAL2_REVOLUTION_PATH = gamesConfig.PORTAL2_REVOLUTION_PATH;

// Проверка наличия путей
if (!PORTAL_PRELUDE_PATH) {
    const msg = translations[currentLanguage].portalPreludePathMissing;
    toastr.error(msg);
    console.error(msg);
}
if (!PORTAL2_PATH) {
    const msg = translations[currentLanguage].portal2PathMissing;
    toastr.error(msg);
    console.error(msg);
}
if (!PORTAL2_REVOLUTION_PATH) {
    const msg = translations[currentLanguage].portalRevolutionPathMissing;
    toastr.error(msg);
    console.error(msg);
}

// Путь к папке с картами
const MAPS_DIR = path.join(PORTAL2_PATH, 'portal2', 'maps');

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

// Конфиги эмулятора стима (прямо в директори игры)
const STEAM_CONFIG_PATH = path.join(PORTAL2_PATH, 'bin', 'steam_settings', 'configs.user.ini');

// Функция для загрузки конфига Steam
function loadSteamConfig() {
    if (fs.existsSync(STEAM_CONFIG_PATH)) {
        try {
            const content = fs.readFileSync(STEAM_CONFIG_PATH, 'utf8');
            const accountNameMatch = content.match(/account_name=([^\n]+)/);
            const steamIdMatch = content.match(/account_steamid=([^\n]+)/);

            if (accountNameMatch && accountNameMatch[1]) {
                $('#accountNameInput').val(accountNameMatch[1].trim());
                $('#accountNameInputConnect').val(accountNameMatch[1].trim());
            }

            if (steamIdMatch && steamIdMatch[1]) {
                $('#accountSteamIDInput').val(steamIdMatch[1].trim());
                $('#accountSteamIDInputConnect').val(steamIdMatch[1].trim());
            }
        } catch (err) {
            console.error('Error reading steam config:', err);
        }
    }
}

// Функция для сохранения конфига Steam
function saveSteamConfig(isServerMode = true) {
    const accountName = isServerMode ? $('#accountNameInput').val() : $('#accountNameInputConnect').val();
    const steamId = isServerMode ? $('#accountSteamIDInput').val() : $('#accountSteamIDInputConnect').val();

    // Проверяем существование файла
    if (!fs.existsSync(STEAM_CONFIG_PATH)) {
        toastr.warning('Steam config file not found: ' + STEAM_CONFIG_PATH);
        return;
    }

    try {
        // Читаем существующий файл
        let content = fs.readFileSync(STEAM_CONFIG_PATH, 'utf8');

        // Заменяем только нужные параметры
        if (accountName) {
            content = content.replace(/^account_name=.*$/m, `account_name=${accountName}`);
        }

        if (steamId) {
            content = content.replace(/^account_steamid=.*$/m, `account_steamid=${steamId}`);
        }

        // Записываем обновленный файл
        fs.writeFileSync(STEAM_CONFIG_PATH, content);

        toastr.success(translations[currentLanguage].configSaved);
    } catch (err) {
        console.error('Error saving steam config:', err);
        toastr.error('Error saving steam config: ' + err.message);
    }
}

// Генерация случайного SteamID (64-bit)
function generateRandomSteamID() {
    // Базовый SteamID (76561197960265728) + случайное число до 1 миллиона
    return '7656119' + Math.floor(7960265728 + Math.random() * 1000000).toString();
}

// Генерация красивого имени аккаунта
function generateNiceAccountName() {
    const adjectives = ['Awesome', 'Epic', 'Legendary', 'Mighty', 'Valiant', 'Brave', 'Clever', 'Daring', 'Eager', 'Fierce'];
    const nouns = ['Player', 'Gamer', 'PortalMaster', 'TestSubject', 'Scientist', 'Explorer', 'Adventurer', 'Hero', 'Champion', 'Winner'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return randomAdj + randomNoun + Math.floor(Math.random() * 100);
}

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
            let msg = 'Target process found: ' + targetProcesses
            console.info(msg)
            toastr.info(msg);

            // minimize current launcher window
            gui.Window.get().minimize();

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
    // Обновляем текст интерфейса
    $('[data-translate]').each(function() {
        const key = $(this).data('translate');
        $(this).text(translations[lang][key]);
    });
}

// Рендер карточек игр
const renderGameCards = (posterStyle = 'main') => {
    console.info('render game cards with style: ' + posterStyle);

    $('#gameCards').empty();

    const trailers = {
        'portal': 'trailers/Portal 1 AMV.mp4',
        'prelude': 'trailers/Portal Prelude Official Trailer.mp4',
        'portal2': 'trailers/Portal 2 Teaser Trailer.mp4',
        'portal_stories': 'trailers/Portal Stories Mel - Trailer.mp4',
        'TWTM': 'trailers/TWTM Trailer Eng.mp4',
        'aperturetag': 'trailers/Portal 2 - Aperture Tag Trailer.mp4',
        'portalreloaded': 'trailers/Portal Reloaded - Reveal Trailer.mp4',
        'portalrevolution': 'trailers/Portal Revolution - Trailer.mp4'
    };

    Object.entries(mods).forEach(([key, mod]) => {
        const card = $(`
            <div class="game-card" style="background-image: url(/images/launcher/${posterStyle}/${mod.image})" alt="${key}">
                <div class="game-card-overlay">
                    <button class="play-button" data-translate="play">Играть</button>
                    <button class="trailer-button" data-video="${trailers[key]}" data-translate="trailer">Трейлер</button>
                </div>
            </div>
        `);

        // Обработчик для кнопки "Играть"
        card.find('.play-button').click(() => {
            if (!mod.path) {
                let msg = 'Path not found for the selected game';
                toastr.error(msg);
                console.error(msg);
                return;
            }

            startMod(mod);
        });

        $('#gameCards').append(card);
    });
};

const mp_wait_for_other_player_notconnecting_timeout_default = '60';
const mp_wait_for_other_player_timeout_default = '100';

// Обновление предпросмотра команды для создания сервера
const updateCreateServerCommandPreview = () => {
    const mapSet = $('#mapSetSelect').val();
    const chapter = $('#chapterSelect').val();
    const map = $('#mapSelect').val();
    const mp_wait_for_other_player_notconnecting_timeout = $('#mp_wait_for_other_player_notconnecting_timeout').val() || mp_wait_for_other_player_notconnecting_timeout_default;
    const mp_wait_for_other_player_timeout = $('#mp_wait_for_other_player_timeout').val() || mp_wait_for_other_player_timeout_default;

    if (mapSet === 'official') {
        // Для официального набора карт проверяем и главу, и карту
        if (chapter && map) {
            const { cmd, terminalCmd } = generateCommand('create', {
                map,
                mapSet,
                mp_wait_for_other_player_notconnecting_timeout,
                mp_wait_for_other_player_timeout
            });
            $('#create-server-command-text').text(cmd);
            $('#create-server-command-terminal-text').text(terminalCmd); // Терминальная команда
        } else {
            $('#create-server-command-text').text(translations[currentLanguage].pleaseSelectChapterAndMap);
            $('#create-server-command-terminal-text').text(translations[currentLanguage].pleaseSelectChapterAndMap);
        }
    } else {
        // Для неофициального набора карт проверяем только карту
        if (map) {
            const { cmd, terminalCmd } = generateCommand('create', {
                map,
                mapSet,
                mp_wait_for_other_player_notconnecting_timeout,
                mp_wait_for_other_player_timeout
            });
            $('#create-server-command-text').text(cmd);
            $('#create-server-command-terminal-text').text(terminalCmd); // Терминальная команда
        } else {
            $('#create-server-command-text').text(translations[currentLanguage].pleaseSelectMap);
            $('#create-server-command-terminal-text').text(translations[currentLanguage].pleaseSelectMap);
        }
    }
};

// Обновление предпросмотра команды для создания разделения экрана
const updateSplitScreenCommandPreview = () => {
    const mapSet = $('#mapSetSelectSplitScreen').val();
    const chapter = $('#chapterSelectSplitScreen').val();
    const map = $('#mapSelectSplitScreen').val();

    if (mapSet === 'official') {
        // Для официального набора карт проверяем и главу, и карту
        if (chapter && map) {
            const { cmd, terminalCmd } = generateCommand('split-screen', { map, mapSet });
            $('#split-screen-command-text').text(cmd);
            $('#split-screen-command-terminal-text').text(terminalCmd); // Терминальная команда
        } else {
            $('#split-screen-command-text').text(translations[currentLanguage].pleaseSelectChapterAndMap);
            $('#split-screen-command-terminal-text').text(translations[currentLanguage].pleaseSelectChapterAndMap);
        }
    } else {
        // Для неофициального набора карт проверяем только карту
        if (map) {
            const { cmd, terminalCmd } = generateCommand('split-screen', { map, mapSet });
            $('#split-screen-command-text').text(cmd);
            $('#split-screen-command-terminal-text').text(terminalCmd); // Терминальная команда
        } else {
            $('#split-screen-command-text').text(translations[currentLanguage].pleaseSelectMap);
            $('#split-screen-command-terminal-text').text(translations[currentLanguage].pleaseSelectMap);
        }
    }
};

// Обновление предпросмотра команды для подключения
const updateConnectionCommandPreview = () => {
    const ip = $('#ipInput').val().trim();
    if (ip) {
        const { cmd, terminalCmd } = generateCommand('connect', { ip });
        $('#connection-command-text').text(cmd);
        $('#connection-command-terminal-text').text(terminalCmd); // Терминальная команда
    } else {
        $('#connection-command-text').text(translations[currentLanguage].pleaseEnterIP);
        $('#connection-command-terminal-text').text(translations[currentLanguage].pleaseEnterIP);
    }
};

// Функция для обновления предпросмотра команды
const updateSingleMapCommandPreview = () => {
    const mapSet = $('#mapSetSelectSingleMap').val();
    const map = $('#mapSelectSingleMap').val();

    if (map) {
        const { cmd, terminalCmd } = generateCommand('single-map', { map, mapSet });
        $('#single-map-command-text').text(cmd);
        $('#single-map-command-terminal-text').text(terminalCmd); // Терминальная команда
    } else {
        $('#single-map-command-text').text(translations[currentLanguage].pleaseSelectMap);
        $('#single-map-command-terminal-text').text(translations[currentLanguage].pleaseSelectMap);
    }
};

function generateCommand(type, options = {}) {
    const baseCmd = `"${PORTAL2_PATH}portal2.exe" -steam -w ${screenWidth} -h ${screenHeight} -console`;
    const getMapIdentifer = (mapSet, map) => (!['official', 'super8'].includes(mapSet) ? path.basename(mapSet) + '/' : '') + map;

    let cmd = '';
    let terminalCmd = '';

    if (type === 'single-map') {
        const { map, mapSet } = options;
        const mapIdentifer = getMapIdentifer(mapSet, map);
        cmd = `${baseCmd} +sv_cheats 1 +map ${mapIdentifer}`;
        terminalCmd = `changelevel ${mapIdentifer}`;
    }

    if (type === 'create') {
        const { map, mapSet, mp_wait_for_other_player_notconnecting_timeout, mp_wait_for_other_player_timeout } = options;
        const mapIdentifer = getMapIdentifer(mapSet, map);
        cmd = `${baseCmd} +sv_cheats 1 +mp_wait_for_other_player_notconnecting_timeout ${mp_wait_for_other_player_notconnecting_timeout} +mp_wait_for_other_player_timeout ${mp_wait_for_other_player_timeout} +map ${mapIdentifer}`;
        terminalCmd = `changelevel ${mapIdentifer}`;
    }

    if (type === 'connect') {
        const { ip } = options;
        cmd = `${baseCmd} +connect ${ip}`;
        terminalCmd = `connect ${ip}`;
    }

    if (type === 'split-screen') {
        const { map, mapSet } = options;
        const mapIdentifer = getMapIdentifer(mapSet, map);
        cmd = `${baseCmd} +sv_cheats 1 +ss_map ${mapIdentifer} +bindtoggle z in_forceuser`;
        terminalCmd = `changelevel ${mapIdentifer}`;
    }

    return { cmd, terminalCmd }; // Возвращаем обе команды
}

// Обновляем список карт для выбранной главы
function updateMapListForChapter(mapSelect, chapterSelect) {
    let selectedChapter = chapterSelect.val();
    mapSelect.empty();

    if (selectedChapter && coopMainChapters[selectedChapter]) {
        coopMainChapters[selectedChapter].forEach(map => {
            if (map) {
                const [namePart, mapIdentifier] = map.split(' - ');

                const getTranslatedMap = (namePart, lang) => {
                    const [englishName, russianName] = namePart.split(' | ');
                    return lang === 'en' ? englishName : russianName
                }

                for (const lang of ['en', 'ru'])
                    if (!(map in translations[lang]))
                        translations[lang][map] = getTranslatedMap(namePart, lang);

                const translatedMap = getTranslatedMap(namePart, currentLanguage);
                // Добавляем карту с переведённым названием и идентификатором
                mapSelect.append(`<option value="${mapIdentifier}" data-translate="${map}">${translatedMap}</option>`);
            }
        });
    }
}

// Функция для получения списка наборов карт
function getMapSets(mode = 'coop') {
    const mapSets = [];

    // Переименовываем папки с пробелами
    renameFoldersWithSpaces(MAPS_DIR);

    // Добавляем официальный набор карт только для кооп-режима
    if (mode === 'coop')  {
        mapSets.push({ name: 'Portal 2 Official Coop', path: 'official' });
    }

    // Сканируем папку maps на наличие папок
    if (fs.existsSync(MAPS_DIR)) {
        const files = fs.readdirSync(MAPS_DIR);
        files.forEach(file => {
            const filePath = path.join(MAPS_DIR, file);
            if (fs.statSync(filePath).isDirectory()) {
                if (file === 'soundcache')
                    return;
                // Фильтруем в зависимости от режима
                if (mode === 'coop' && file.toUpperCase().endsWith('COOP')) {
                    mapSets.push({ name: file, path: filePath });
                } else if (mode === 'single' && !file.toUpperCase().endsWith('COOP')) {
                    mapSets.push({ name: file, path: filePath });
                }
            }
        });
    } else {
        toastr.error('Директория с картами не найдена: ' + MAPS_DIR);
    }

    // Проверяем существование карты e1912.bsp
    const super8MapPath = path.join(PORTAL2_PATH, 'portal2', 'maps', 'e1912.bsp');
    if (mode === 'single' && fs.existsSync(super8MapPath)) {
        // Добавляем набор карт "Super8" с одной картой только для одиночного режима
        mapSets.push({
            name: 'Super8',
            path: 'super8'
        });
    }

    return mapSets;
}

// Функция для заполнения выпадающего списка наборов карт
function populateMapSetSelect(selectorId, mode = 'coop') {
    const mapSetSelect = $(selectorId);
    mapSetSelect.empty();

    // Добавляем кастомные карты
    getMapSets(mode).forEach(mapSet => {
        mapSetSelect.append(`<option value="${mapSet.path}">${mapSet.name}</option>`);
    });
}

function handleMapSetChange(mapSetSelect, mapSelect, chapterSelect, updateCommandPreview, mode = 'coop') {
    const selectedMapSet = mapSetSelect.val();
    // Сбрасываем выпадающий список карт
    mapSelect.empty();

    if (selectedMapSet === 'official' && (mode === 'coop' || mode === 'split-screen')) {
        // Если выбран официальный набор карт и режим кооп или разделение экрана, показываем выбор глав и карт
        chapterSelect.closest('.input-group').removeClass('d-none'); // Показываем выбор главы
        mapSelect.closest('.input-group').removeClass('d-none'); // Показываем выбор карты
        chapterSelect.empty();

        Object.entries(coopMainChapters).forEach(([chapter, maps]) => {
            if (chapter) {
                const getTranslatedChapter = (chapter, lang) => chapter.split(' | ')[lang === 'en' ? 0 : 1]

                for (const lang of ['en', 'ru'])
                    if (!(chapter in translations[lang]))
                        translations[lang][chapter] = getTranslatedChapter(chapter, lang);

                const translatedChapter = getTranslatedChapter(chapter, currentLanguage)
                chapterSelect.append(`<option value="${chapter}" data-translate="${chapter}">${translatedChapter}</option>`);
            }
        });

        chapterSelect.change();
    } else if (selectedMapSet) {
        // Если выбран кастомный набор карт, скрываем выбор глав и показываем только карты
        chapterSelect.closest('.input-group').addClass('d-none'); // Скрываем выбор главы
        mapSelect.closest('.input-group').removeClass('d-none'); // Показываем выбор карты

        // Если выбран набор "Super8", добавляем только карту e1912.bsp
        if (path.basename(selectedMapSet) === 'super8' ) {
            mapSelect.append(`<option value="e1912">e1912</option>`);
        } else {
            // Очищаем и заполняем список карт из выбранной папки
            const maps = fs.readdirSync(selectedMapSet).filter(file => file.endsWith('.bsp'));
            maps.forEach(map => {
                const mapName = path.basename(map, '.bsp');
                mapSelect.append(`<option value="${mapName}">${mapName}</option>`);
            });
        }
    }

    // Обновляем предпросмотр команды
    updateCommandPreview();
}

function renameFoldersWithSpaces(directory) {
    if (!fs.existsSync(directory)) {
        console.error(`Папка не найдена: ${directory}`);
        return;
    }

    const folders = fs.readdirSync(directory).filter(file => {
        const filePath = path.join(directory, file);
        return fs.statSync(filePath).isDirectory() && (file.includes(' ') || file.includes('\''));
    });

    folders.forEach(folder => {
        const oldPath = path.join(directory, folder);
        const newFolderName = folder.replace(/(\s|')+/g, '-'); // Заменяем пробелы на тире
        const newPath = path.join(directory, newFolderName);

        try {
            fs.renameSync(oldPath, newPath);
            console.log(`Переименовано: ${oldPath} -> ${newPath}`);
        } catch (err) {
            console.error(`Ошибка при переименовании ${oldPath}:`, err);
        }
    });
}

$(document).ready(() => {
    // Определяем язык по умолчанию
    currentLanguage = getCookie('language') || getSystemLanguage();

    // Сохраняем набор иконок в куки при изменении
    $('.poster-style')
        .change(function() {
            const selectedPosterStyle = $(this).val();
            renderGameCards(selectedPosterStyle);
            setCookie('posterStyle', selectedPosterStyle, 365); // Сохраняем на год
        })
        .val(getCookie('posterStyle') ||  'main')
        .change();

    // Open all _blank links in external browser
    $('a[target=_blank]').on('click', function(){
        require('nw.gui').Shell.openExternal( this.href );
        return false;
    });

    // Обработчик для кнопки "Трейлер"
    $(document).on('click', '.trailer-button', function(event) {
        event.stopPropagation(); // Предотвращаем всплытие события
        const videoSrc = $(this).data('video');
        $('#trailerVideo source').attr('src', videoSrc);
        $('#trailerVideo')[0].load();
        $('#trailerVideo')[0].play(); // Запускаем воспроизведение
        $('#videoModal').fadeIn();
    });

    // Обработчик для кнопки закрытия
    $('#closeVideoModal').click(function() {
        $('#trailerVideo')[0].pause();
        $('#videoModal').fadeOut();
    });

    // Закрытие модального окна при клике вне его
    $(window).click(function(event) {
        if ($(event.target).is('#videoModal')) {
            $('#trailerVideo')[0].pause();
            $('#videoModal').fadeOut();
        }
    });

    $('#mapSetSelect').change(function() {
        handleMapSetChange(
            $(this),
            $('#mapSelect'),
            $('#chapterSelect'),
            updateCreateServerCommandPreview,
            'coop'
        );
    });

    $('#mapSetSelectSingleMap').change(function() {
        handleMapSetChange(
            $(this),
            $('#mapSelectSingleMap'),
            $('#chapterSelectSingleMap'),
            updateSingleMapCommandPreview,
            'single'
        );
    });

    // Обработчик для разделения экрана
    $('#mapSetSelectSplitScreen').change(function () {
        handleMapSetChange(
            $(this),
            $('#mapSelectSplitScreen'),
            $('#chapterSelectSplitScreen'),
            updateSplitScreenCommandPreview,
            'coop'
        );
    });

    $('#mp_wait_for_other_player_notconnecting_timeout, #mp_wait_for_other_player_timeout')
        .on('input', updateCreateServerCommandPreview);

    $('#mapSelect').change(function () {
        updateCreateServerCommandPreview();
    });

    $('#mapSelectSingleMap').change(function() {
        updateSingleMapCommandPreview();
    });

    $('#mapSelectSplitScreen').change(function () {
        updateSplitScreenCommandPreview();
    })

    $('#ipInput').on('input', updateConnectionCommandPreview);

    $('#chapterSelect').change(function() {
        updateMapListForChapter($('#mapSelect'), $(this));
        updateCreateServerCommandPreview();
    });

    $('#chapterSelectSplitScreen').change(function() {
        updateMapListForChapter($('#mapSelectSplitScreen'), $(this));
        updateSplitScreenCommandPreview();
    });

    // Инициализация перевода
    translateUI(currentLanguage);

    $('.language-select')
        .change(function() {
            // Меняем язык
            currentLanguage = $(this).val();
            translateUI(currentLanguage);
            setCookie('language', currentLanguage, 365); // Сохраняем на год
        })
        .val(currentLanguage)
        .change();

    // Обработчик кнопки "Дополнительные одиночные карты"
    $('.toggle-single-map').click(function() {
        // Переключаем режимы
        $('.game-grid').addClass('d-none');
        $('.single-map-creation').removeClass('d-none');
        $('.coop-mode-select').addClass('d-none');
        $('.toggle-single-mode').removeClass('d-none');
        $('.toggle-single-map').addClass('d-none');
        $('.toggle-coop').removeClass('d-none');
        $('.server-creation').addClass('d-none');
        $('.split-screen-creation').addClass('d-none');
        $('.connection').addClass('d-none');
    });

    // Обработчик кнопки "Одиночный режим"
    $('.toggle-single-mode').click(function() {
        $('.game-grid').removeClass('d-none');
        $('.coop-mode-select').addClass('d-none');
        $('.single-map-creation').addClass('d-none');
        $('.toggle-single-mode').addClass('d-none');
        $('.toggle-single-map').removeClass('d-none');
        $('.toggle-coop').removeClass('d-none');
        $('.server-creation').addClass('d-none');
        $('.split-screen-creation').addClass('d-none');
        $('.connection').addClass('d-none');
    });

    // Обработчик кнопки "Кооперативный режим"
    $('.toggle-coop').click(function() {
        // Переключаем режимы
        $('.game-grid').addClass('d-none');
        $('.coop-mode-select').removeClass('d-none');
        $('.single-map-creation').addClass('d-none');
        $('.toggle-single-mode').removeClass('d-none');
        $('.toggle-single-map').removeClass('d-none');
        $('.toggle-coop').addClass('d-none');
        $('.server-creation').addClass('d-none');
        $('.split-screen-creation').addClass('d-none');
        $('.connection').addClass('d-none');
    });

    // Обработчик кнопки "Запустить карту"
    $('.start-single-map').click(function() {
        const mapSet = $('#mapSetSelectSingleMap').val();
        const map = $('#mapSelectSingleMap').val();

        if (map) {
            const {cmd, terminalCmd} = generateCommand('single-map', { map, mapSet });
            console.info('Command pre execute', cmd)
            executeCommand(cmd);
        } else {
            toastr.error(translations[currentLanguage].pleaseSelectMap);
        }
    });

    // Обновляем выпадающий список наборов карт для одиночного режима
    populateMapSetSelect('#mapSetSelectSingleMap', 'single');
    $('#mapSetSelectSingleMap').change()

    populateMapSetSelect('#mapSetSelectSplitScreen', 'coop');
    $('#mapSetSelectSplitScreen').change()

    populateMapSetSelect('#mapSetSelect', 'coop');
    $('#mapSetSelect').change()

    // Обработчик выбора "Создать сервер"
    $('#createServerCard').click(function() {
        $('.coop-mode-select').addClass('d-none');
        $('.server-creation').removeClass('d-none');
    });

    // Обработчик выбора "Подключиться к серверу"
    $('#connectServerCard').click(function() {
        $('.coop-mode-select').addClass('d-none');
        $('.connection').removeClass('d-none');
    });

    // Обработчик выбора "Создать разделение экрана"
    $('#splitScreenCard').click(function() {
        $('.coop-mode-select').addClass('d-none');
        $('.split-screen-creation').removeClass('d-none');
    });

    // Обработчик кнопки "Подключиться к серверу"
    $('.connect-server').click(function() {
        saveSteamConfig(false); // Сохраняем конфиг перед подключением

        const ip = $('#ipInput').val().trim();
        if (ip) {
            const cmd = `"${PORTAL2_PATH}portal2.exe" -steam -w ${screenWidth} -h ${screenHeight} -console +connect ${ip}`;
            executeCommand(cmd);
        } else {
            toastr.error(translations[currentLanguage].pleaseEnterIP);
        }
    });

    // Обработчик кнопки "Назад" в кооп-режиме
    $('.back-btn').click(function() {
        $('.server-creation, .connection, .split-screen-creation').addClass('d-none'); // Скрываем все формы кооп-режима
        $('.coop-mode-select').removeClass('d-none'); // Показываем форму выбора кооп-режима
    });

    // Загружаем конфиг Steam при запуске
    loadSteamConfig();

    // Обработчики генерации SteamID
    $('.generate-steam-id').click(function() {
        const newSteamID = generateRandomSteamID();
        if ($(this).closest('.server-creation').length) {
            $('#accountSteamIDInput').val(newSteamID);
        } else {
            $('#accountSteamIDInputConnect').val(newSteamID);
        }
        toastr.success(translations[currentLanguage].steamIdGenerated);
    });

    // Обработчики генерации имени аккаунта
    $('.generate-account-name').click(function() {
        const newName = generateNiceAccountName();
        if ($(this).closest('.server-creation').length) {
            $('#accountNameInput').val(newName);
        } else {
            $('#accountNameInputConnect').val(newName);
        }
        toastr.success(translations[currentLanguage].accountNameGenerated);
    });

    // Обработчик кнопки "Запустить сервер"
    $('.start-server').click(function() {
        saveSteamConfig(true); // Сохраняем конфиг перед запуском сервера

        const mapSet = $('#mapSetSelect').val();
        const chapter = $('#chapterSelect').val();
        const map = $('#mapSelect').val();
        const mp_wait_for_other_player_notconnecting_timeout = $('#mp_wait_for_other_player_notconnecting_timeout').val() || mp_wait_for_other_player_notconnecting_timeout_default;
        const mp_wait_for_other_player_timeout = $('#mp_wait_for_other_player_timeout').val() || mp_wait_for_other_player_timeout_default;

        if (mapSet === 'official') {
            // Для официального набора карт проверяем и главу, и карту
            if (chapter && map) {
                const {cmd, terminalCmd} = generateCommand('create', {
                    map,
                    mapSet,
                    mp_wait_for_other_player_notconnecting_timeout,
                    mp_wait_for_other_player_timeout
                });
                executeCommand(cmd);
            } else {
                toastr.error(translations[currentLanguage].pleaseSelectChapterAndMap);
            }
        } else {
            // Для неофициального набора карт проверяем только карту
            if (map) {
                const {cmd, terminalCmd} = generateCommand('create', {
                    map,
                    mapSet,
                    mp_wait_for_other_player_notconnecting_timeout,
                    mp_wait_for_other_player_timeout
                });
                executeCommand(cmd);
            } else {
                toastr.error(translations[currentLanguage].pleaseSelectMap);
            }
        }
    });

    // Обработчик кнопки "Запустить разделение экрана"
    $('.start-split-screen').click(function() {
        const mapSet = $('#mapSetSelectSplitScreen').val(); // Получаем выбранный набор карт
        const chapter = $('#chapterSelectSplitScreen').val();
        const map = $('#mapSelectSplitScreen').val();

        if (mapSet === 'official') {
            // Для официального набора карт проверяем и главу, и карту
            if (chapter && map) {
                const {cmd, terminalCmd} = generateCommand('split-screen', { map, mapSet });
                executeCommand(cmd);
            } else {
                toastr.error(translations[currentLanguage].pleaseSelectChapterAndMap);
            }
        } else {
            // Для неофициального набора карт проверяем только карту
            if (map) {
                const {cmd, terminalCmd} = generateCommand('split-screen', { map, mapSet });
                executeCommand(cmd);
            } else {
                toastr.error(translations[currentLanguage].pleaseSelectMap);
            }
        }
    });
});