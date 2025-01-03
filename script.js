const PORTAL_PRELUDE_PATH = 'Portal + Portal Prelude NEW RUS\\'
const PORTAL2_PATH = 'Portal 2 NEW RUS\\'
const PORTAL2_REVOLUTION_PATH = 'Portal Revolution NEW RUS\\'

// Всяк коллекция игр для прокрутки в главном меню
let mods = {
    'portal': {
        image: 'portal.png',
        fileName: 'hl2.exe',
        params: ['-steam', '-game portal'],
        path: PORTAL_PRELUDE_PATH
    },

    'prelude': {
        image: 'portal_prelude.png',
        fileName: 'hl2.exe',
        params: ['-steam', '-game prelude'],
        path: PORTAL_PRELUDE_PATH
    },

    'portal2': {
        image: 'portal2.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game portal2'],
        path: PORTAL2_PATH
    },

    'portal_stories': {
        image: 'portal2_storiesmel.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game portal_stories'],
        path: PORTAL2_PATH
    },

    'TWTM': {
        image: 'portal2_twtm.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game TWTM'],
        path: PORTAL2_PATH
    },

    'aperturetag': {
        image: 'portal2_aperturetag.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game aperturetag'],
        path: PORTAL2_PATH
    },

    'portalreloaded': {
        image: 'portal2_reloaded.png',
        fileName: 'portal2.exe',
        params: ['-steam', '-game portalreloaded'],
        path: PORTAL2_PATH
    },

    'portalrevolution': {
        image: 'portal2_revolution',
        fileName: 'revolution.exe',
        params: [],
        path: PORTAL2_REVOLUTION_PATH + 'bin\\win64\\'
    }
}

let exec = require('child_process').execFile;
/**
 * Function to execute exe
 * @param {string} fileName The name of the executable file to run.
 * @param {string[]} params List of string arguments.
 * @param {string} path Current working directory of the child process.
 */
function execute(fileName, params, path) {
	let promise = new Promise((resolve, reject) => {
		exec(fileName, params, { cwd: path }, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});

	});
	return promise;
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


$('.start-server').click(() => {
})