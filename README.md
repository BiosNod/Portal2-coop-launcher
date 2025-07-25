## 🎮 Установка кастомных карт для Portal 2 (кооператив + одиночные):
1. Загрузить огромный набор .bsp карт (V2):
   - Ссылка 1: https://drive.google.com/file/d/1utOHWX_2Sm60eZYrxdoQjfZZow1Wm5Bm/view?usp=sharing
   - Ссылка 2 (альтернативная): https://github.com/BiosNod/Portal2-coop-launcher/releases/download/res/Portal2.custom.maps.+.coop.v2.7z
2. Внутри директории по названиям наборов карт, если в конце COOP - это кооперативные карты, если SP или в конце нет COOP, то одиночные,
   в этих директориях сами карты .bsp. Нужно просто кинуть все директории из этого архива в корень игры `C:\[...]\Portal 2\portal2\` чтобы в `maps`
   у вас были директории наборов карт, а в других все необходимые ресурсы для новых карт

## 📱 Установка кастомных карт для Portal 1

1. Загрузить набор карт:
   - Ссылка 1: https://drive.google.com/file/d/1XNStIp02YxvagSLgIzzWzuK-ZOTmcqa2/view?usp=sharing
   - Ссылка 2 (альтернативная): https://github.com/BiosNod/Portal2-coop-launcher/releases/download/res/Portal.1.custom.maps.7z
2. Закинуть в директорию с игрой (в ней уже должна быть папка `portal`)
3. В меню бонусные карты должен появиться пункт `custom maps` (последний пункт), запуск прямо из игры, без лаунчера

## 👾 Установка лаунчера для запуска коопа + выбора карт
Загрузите лаунчер из раздела `releases` с `github`:
   - Ссылка: https://github.com/BiosNod/Portal2-coop-launcher/releases
   - Ссылка на последний релизный билд: https://github.com/BiosNod/Portal2-coop-launcher/releases/download/1.1/Portal2COOPLauncher-1.1-windows-x64.7z

Если же вы не доверяете готовым билдам, то обратитесь к инструкции далее `Как собрать лаунчер`.
После того, как вы загрузили или самостоятельно собрали лаунчер, то в директории лаунчера найдите файл `games.json` и открой его с помощью любого текстового редактора.

Замените пути к играм согласно вашему расположению на диске:

      {
         "PORTAL_PRELUDE_PATH": "<Full path>\\Portal + Portal Prelude\\",
         "PORTAL2_PATH": "<Full path>\\Portal 2\\",
         "PORTAL2_REVOLUTION_PATH": "<Full path>\\Portal Revolution 1.6.1\\"
      }

Можно также использовать относительные пути, например, две точки означают, что это директория выше лаунчера на 1 уровень:

      {
         "PORTAL_PRELUDE_PATH": "..\\Portal + Portal Prelude\\",
         "PORTAL2_PATH": "..\\Portal 2\\",
         "PORTAL2_REVOLUTION_PATH": "..\\Portal Revolution 1.6.1\\"
      }

(можно и на 2 уровня выше `..\\..\\Portal + Portal Prelude\\`)

Можно использовать прямой слеш вместо двух обратных для разделения:

      {
         "PORTAL_PRELUDE_PATH": "../Portal + Portal Prelude/",
         "PORTAL2_PATH": "../Portal 2/",
         "PORTAL2_REVOLUTION_PATH": "../Portal Revolution 1.6.1/"
      }

Запустите лаунчер через `Portal2COOPLauncher.exe`, проверьте, нет ли всплывающих уведомлений об ошибках.
Далее (я очень надеюсь), вы самостоятельно справитесь с интерфейсом.

![Иллюстрация к проекту](/images/launcher/ui/1.jpg)

![Иллюстрация к проекту](/images/launcher/ui/2.jpg)

![Иллюстрация к проекту](/images/launcher/ui/3.jpg)

![Иллюстрация к проекту](/images/launcher/ui/4.jpg)

## 🛠️ Как собрать лаунчер самому

Если вы уже скачали собранный лаунчер из раздела `releases`, то полностью пропустите этот пункт если у вас нет желания собирать из исходников.

Установите `git`, склонируйте этот репозиторий через

    git clone <репозиторий.git>

Установите NodeJS: https://nodejs.org/en/download/current

В директории с проектом выполните команд для установки зависимостей:

    npm install

После чего должна появиться директория `node_modules`

Загрузите последний `nwjs` (сборка проверялась на `nwjs-sdk-v0.87.0-win-x64`), распакуйте куда-нибудь

Попробуйте запустить лаунчер из исходников без сборки через `nwjs`:

    nwjs.exe <project_path>

`nwjs.exe` - это программа из `nwjs-sdk-v0.87.0-win-x64`

Если же у вас есть, например, `WebStorm`, вы можете открыть этот проект в нём и создать такую конфигурацию запуска:

![Иллюстрация к проекту](/images/launcher/build/webstorm.jpg)

После чего запуск можно будет осуществлять прямо в интерфейсе среды разработки.

Чтобы в трейлерах был звук, нужно отдельно загрузить ffmmpeg.dll в директорию nwjs.
Об этом написано здесь: https://docs.nwjs.io/en/latest/For%20Developers/Enable%20Proprietary%20Codecs/#get-ffmpeg-binaries-from-the-community

Нужно загрузить отсюда https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases архив под вашу версию nwjs, распаковать и заменить файл ffmpeg.dll в корне nwjs (не в корне лаунчера).

Трейлеры к играм загружаем отсюда https://drive.google.com/file/d/1DO_fDLR5BwwfJe7u6m7CdgtqPAo1rAvN/view?usp=sharing и распаковываем в директорию `trailers` в корне проекта лаунчера.

Если все запустилось и работает, то загружаем `Web2Exe` https://github.com/nwutils/Web2Executable/releases для дальнейшей сборки лаунчера.

Убедитесь, что все настройки верны и без проблем:

![Иллюстрация к проекту](/images/launcher/build/web2exe-download.jpg)

![Иллюстрация к проекту](/images/launcher/build/web2exe-export.jpg)

Нажмите `export`

Сборка появится рядом с директорией проекта, представляет из себя директорию, если нужен один `exe`, то можете отдельно запаковать с помощью `Enigma virtualbox`

## 🧩 Визуальные проблемы

- Если у вас не запускаются некоторые карты, то попробуйте ввести в консоли update_addon_paths

- Если у вас возникли проблемы с освещением (нету теней, черезчур светло), введите в консоль "mat_fullbright 1", это должно решить вашу проблему. Если тени появились, установите параметр обратно в "mat_fullbright 0" и перезапустите игру.

- Если у вас пропал прицел, введите в консоль crosshair 1

## 🕹️ Не работает клавиша E

Наблюдается проблема с тем, что в самом начале Portal 2 нет подсказок и нет возможности нажать на E чтобы спать,
находим файл `<Директори игры>\portal2\gameinfo.txt`

В нём ищем строки

    SearchPaths
    {
        Game				|gameinfo_path|.
        game				portal_stories
        game				TWTM
    }
    
Затем удаляем

    game				portal_stories
    game				TWTM
    
Т.е. получится так

    SearchPaths
    {
        Game				|gameinfo_path|.
    }

После чего запустите игру, зайдите в настройки -> раскладка клавиатуры (клавиши) -> использовать стандартую раскладку (сбросить раскладку). Сейчас клавиши правильно сбросились, в том числе и `E`.

## 🕹️ В игре нет подсказок, как включить?

Обычно это заметно если в прологе Portal2 нет указателей куда посмотреть и как лечь спать. 
Идём в файл `<Директория игры>\cfg\config.cfg`
и находим строку `gameinstructor_enable`

Ставим справа от неё `"1"` (если не нашли строку, то просто добавляем):
`gameinstructor_enable "1"`
Вместе с кавычками!

Можно на всякий случай ещё поставить `gameinstructor_enable "1"` дополнительно по пути:

    Documents\Steam\CODEX\620\remote\cfg\config.cfg

Если вы играете через `SandBoxie`, то в

    <Директория с песочницей>\<имя пользователя>\public\Documents\Steam\CODEX\620\remote\cfg\config.cfg

После чего заходим в игру, идём в настройки, после чего ОБЯЗАТЕЛЬНО нажимаем "использовать стандартные настройки", это
восстановит нормальную раскладку и запишет данные в config.cfg, после
этого E и прочие кнопки должны обрабатываться игрой без проблем. Сброс НЕ работает если в gameinfo.txt есть несколько game, поэтому ранее мы удаляли все остальные кроме первой основной игры в случае проблемы кнопки E.

Также значение gameinstructor_enable вы можете изменить через терминал в игре, жмём тильду, вводим

    gameinstructor_enable 1

после чего это значение будет записано в config.cfg и вам больше НЕ нужно будет никогда писать эту команду снова и все подсказки
в игре будут работать.

## 🚫 Не могу пройти кооперативные карты-песочницы (Rapture-Sandboxie)
### ответ: они без прохождения
    mp_coop_tic_tac_toe
    mp_coop_football
    mp_coop_basketball
    mp_coop_playground
    mp_coop_high_jump_playground
    mp_coop_firelemons
    mp_coop_bowling
    mp_coop_funbox_v1
    mp_coop_playground_ice_b1
    mp_coop_portal_playground_v1_d


## 🖥️ Как запускать кооператив и кастомные карты без лаунчера
Командой:

    portal2.exe -console +sv_cheats 1 +mp_wait_for_other_player_notconnecting_timeout 600 +mp_wait_for_other_player_timeout 120 +map mp_coop_lobby_2

(либо прямо из игры можно нажать на тильду ~ в меню и написать просто последовательно команды "sv_cheats 1", "mp_wait_for_other_player_notconnecting_timeout 600", "mp_wait_for_other_player_timeout 120", "map mp_coop_lobby_2")

Где mp_coop_lobby_2 - это карта, с которой начинать кооп, однако, чтобы другой пользователь мог к вам подключиться нужно выполнить некоторые требования из-за того, что вы будете поднимать личный сервер вместо использования стима:
- у вас должен быть белый внешний ip адрес (динамический или статический - без разницы, главное чтобы вы были БЕЗ NAT провайдера, можете погуглить что такое NAT), либо провайдер бесплатно вам выдаёт динамический внешний IP без NAT, либо вы покупаете эту услугу отдельно в виде статического IP без NAT, иначе при двойном NAT в виде NAT провайдера + NAT роутера работать подключение не будет, т.к. в отличие от своего личного NAT на вашем роутере вы в любом случае не можете создавать правила перенаправления портов через NAT провайдера
- должен быть проброшен порт 27015 с роутера на ваш ПК (пропустите этот момент если Ethernet кабель воткнут сразу в ПК без роутера). Свой внешний IP можете узнать https://2ip.ru/, а внутренний IP за NAT роутера (не путать с NAT провайдера) через команду ipconfig в CMD Windows, либо через саму админку роутера посмотрите IP адреса ваших устройств, обычно это адрес вида 192.168.0.x, вот нужно будет создать правило перенаправления порта на этот внутренний IP компа с сервером в админке роутера. Т.е. получится так, что когда пакет приходит на роутер, то он читает правила перенаправлений портов и перенаправляет его с помощью своего NAT (не NAT провайдера) на указанный адрес компа вида 192.168.0.x, надеюсь, что объяснил доступно!
- в брандмауэре (сетевом экране) Windows должно быть разрешение на этот порт, либо создаёте правило для порта с разрешением всего и всея, либо просто отключаете сетевой экран (на свой страх и риск)
- Если вы никак не можете получить внешний белый IP адрес, то вместо всех пунктов выше можете попробовать использовать хамачи (используя сервера хамачи) или же собственный впн с одной сетью и возможностью общения между юзерами (но вам придётся узнать свои собственные IP через специальные команды, вам придётся гуглить как это сделать для вашего типа впн)

После выполнения команды выше, портал2 поднимет сервак прямо на ПК и будет ждать подключения игроков, далее другой игрок соединяется так:

    portal2.exe -console +connect 21.21.21.21

(либо прямо из игры друг может нажать на тильду ~ в меню и написать просто "connect 21.21.21.21"). Писать название карты тому, кто присоединяется НЕ нужно, будет та карта, которую указал хостер сервера при запуске.

Где 21.21.21.21 - это ваш доступный IP, на котором поднят сервер (внешний белый или виртуальный внутри впн). После чего если вы не ошиблись в пробросе порта и ip адресе, то сервер соединит игроков (на пиратке в том числе) и бросит игроков на указанную карту.

Единственное но - в самом начале на пиратке на самой первой стартовой карте "mp_coop_lobby_2" (карта "Распределитель", из которой запускаются все другие карты) не будет возможности запустить другую карту с компа рядом с воздушнымии трубами, поэтому просто либо запустите сервер сразу с карты mp_coop_start (это следующая после mp_coop_lobby_2, вы ничего не теряете), либо когда дойдёте до воздушных труб, то хостер сервера должен открыть терминал на тильду ~ и написать команду смены карты

    changelevel mp_coop_start

Или изначально запустить её:

    portal2.exe -console +sv_cheats 1 +mp_wait_for_other_player_notconnecting_timeout 600 +mp_wait_for_other_player_timeout 120 +map mp_coop_start

Дальше уже все нормально работает, когда проходите с другом карту, то надо запоминать на какой карте остановились (тоже смотрите название текущей карты через терминал перед выходом), если что-то не работает на уровне, то хостер в любой момент может написать команду смены карты на следующую (список ниже напишу).
Также есть вероятный фикс (я не проверял) для возможности запуска карт из распределительной карты и сохранения прогресса:
https://steamcommunity.com/sharedfiles/filedetails/?l=swedish&id=679333142
(однако, я не проверял этот фикс)

## 🔄 Смена карты без переподключения
Для смены карты без переподключения напарника вместо команды `map` вводите

    changelevel [название_карты]

## 📂 Список всех официальных кооперативных карт
    'Chapter 0: Hub and Calibration Course | Глава 0: Распределитель и курс калибровки': [
        '01 Hub | 01 Распределитель - mp_coop_lobby_2',
        '02 Calibration Course | 02 Курс калибровки - mp_coop_start'
    ],
    
    'Chapter 1: Team Building | Глава 1: Командная игра': [
        '01 Doors | 01 Двери - mp_coop_doors',
        '02 Buttons | 02 Кнопки - mp_coop_race_2',
        '03 Lasers | 03 Лазеры - mp_coop_laser_2',
        '04 Rat Maze | 04 Крысиный лабиринт - mp_coop_rat_maze',
        '05 Laser Crusher - mp_coop_laser_crusher | 05 Лазерная дробилка - mp_coop_laser_crusher',
        '06 Behind the scenes - mp_coop_teambts | 06 За кулисами - mp_coop_teambts'
    ],
    
    'Chapter 2: Mass and Velocity | Глава 2: Масса и скорость': [
        '01 Flings | 01 Ленты - mp_coop_fling_3',
        '02 Infinifling | 02 Без препятствий - mp_coop_infinifling_train',
        '03 Team Retrieval | 03 Поиск команды - mp_coop_come_along',
        '04 Vertical Flings | 04 Vertical Flings - mp_coop_fling_1',
        '05 Catapults | 05 Катапульты - mp_coop_catapult_1',
        '06 Multifling | 06 Multifling - mp_coop_multifling_1',
        '07 Fling Crushers | 07 Fling Crushers - mp_coop_fling_crushers',
        '08 Industrial Fan | 08 Industrial Fan - mp_coop_fan'
    ],
    
    'Chapter 3: Hard-Light Surfaces | Глава 3: Мосты плотного света': [
        '01 Cooperative Bridges | 01 Кооперативные мосты - mp_coop_wall_intro',
        '02 Bridge Swap | 02 Обмен мостами - mp_coop_wall_2',
        '03 Fling Block | 03 Fling Block - mp_coop_catapult_wall_intro',
        '04 Catapult Block | 04 Блок катапульты - mp_coop_wall_block',
        '05 Bridge Fling | 05 Bridge Fling - mp_coop_catapult_2',
        '06 Turret Walls | 06 Стены из турелей - mp_coop_turret_walls',
        '07 Turret Assassin | 07 Убийца турелей - mp_coop_turret_ball',
        '08 Bridge Testing | 08 Проверка моста - mp_coop_wall_5'
    ],
    
    'Chapter 4: Excursion Funnels | Глава 4: Экскурсионные воронки': [
        '01 Cooperative Funnels | 01 Cooperative Funnels - mp_coop_tbeam_redirect',
        '02 Funnel Drill | 02 Funnel Drill - mp_coop_tbeam_drill',
        '03 Funnel Catch | 03 Funnel Catch - mp_coop_tbeam_catch_grind_1',
        '04 Funnel Laser | 04 Funnel Laser - mp_coop_tbeam_laser_1',
        '05 Cooperative Polarity | 05 Совместная полярность - mp_coop_tbeam_polarity',
        '06 Funnel Hop | 06 Funnel Hop - mp_coop_tbeam_polarity2',
        '07 Advanced Polarity | 07 Продвинутая полярность - mp_coop_tbeam_polarity3',
        '08 Funnel Maze | 08 Funnel Maze - mp_coop_tbeam_maze',
        '09 Turret Warehouse | 09 Склад турелей - mp_coop_tbeam_end'
    ],
    
    'Chapter 5: Mobility Gels | Глава 5: Ускоряющие гели': [
        '01 Repulsion Jumps | 01 Repulsion Jumps - mp_coop_paint_come_along',
        '02 Double Bounce | 02 Двойной отскок - mp_coop_paint_redirect',
        '03 Bridge Repulsion | 03 Мостовое отталкивание - mp_coop_paint_bridge',
        '04 Wall Repulsion | 04 Настенное отталкивание - mp_coop_paint_walljumps',
        '05 Propulsion Crushers | 05 Propulsion Crushers - mp_coop_paint_speed_fling',
        '06 Turret Ninja | 06 Turret Ninja - mp_coop_paint_red_racer',
        '07 Propulsion Retrieval | 07 Propulsion Retrieval - mp_coop_paint_speed_catch',
        '08 Vault Entrance | 08 Vault Entrance - mp_coop_paint_longjump_intro'
    ],
    
    'Additional chapter: Art Therapy (DLC) | Дополнительная глава: Арт-терапия (DLC)': [
        '01 Separation | 01 Разделение - mp_coop_separation_1',
        '02 Triple Axis | 02 Тройная ось - mp_coop_tripleaxis',
        '03 Catapult Catch | 03 Catapult Catch - mp_coop_catapult_catch',
        '04 Bridge Gels | 04 Мостовые гели - mp_coop_2paints_1bridge',
        '05 Maintenance | 05 Обслуживание - mp_coop_paint_conversion',
        '06 Bridge Catch | 06 Bridge Catch - mp_coop_bridge_catch',
        '07 Double Lift | 07 Двухместный лифт - mp_coop_laser_tbeam',
        '08 Gel Maze | 08 Гелевой лабиринт - mp_coop_paint_rat_maze',
        '09 Crazier Box | 09 Безумная коробка - mp_coop_paint_crazy_box',
    ]

## 📝 Как найти дополнительные кооперативные и сюжетные карты в SteamWorkShop
Также после прохождения основного кооператива настоятельно рекомендую скачать множество дополнительных кооп карт из Steam Workshop, показываю на примере для пиратки:

Находим в воркшопе карты "гонок на гелях" (их 3):
https://steamcommunity.com/sharedfiles/filedetails/?id=91038223
https://steamcommunity.com/sharedfiles/filedetails/?id=96704281
https://steamcommunity.com/sharedfiles/filedetails/?id=115869888

Идём на другой сайт для загрузки данных с воркшопа (для пиратки) - https://steamworkshopdownloader.io/
Копируем каждую ссылку сюда, далее появится зелёная длинная ссылка, загружаем по ней файл карты в формате .bsp

Т.е. у вас должны быть загружены 3 карты гонок на гелях:

    'mymaps_mp_coop_gelocity_1_v02.bsp',
    'mymaps_mp_coop_gelocity_2_v01.bsp',
    'mymaps_mp_coop_gelocity_3_v02.bsp',

Закидываем эти карты обоим игрокам к остальным картам по пути:
`Portal 2\portal2\maps`

Затем как обычно создаёте сервер с указанием названия карты БЕЗ расширения .bsp:

    portal2.exe -console +sv_cheats 1 +mp_wait_for_other_player_notconnecting_timeout 600 +mp_wait_for_other_player_timeout 120 +map mymaps_mp_coop_gelocity_1_v02

(или из игры через терминал отдельно вводите каждую команду), игра найдёт эту карту из директории maps и запустит её.

Если же вы хотите запускать эти карты через лаунчер, то нужно будет внутри директории `maps` создать вложенную директорию с названием нового набора карт, например, `Gelocity-COOP`, в конце должно быть обязательно `COOP` если это кооперативный режим и наоборот `COOP` не должно быть в конце если это одиночный режим, т.к. лаунчер создаёт разные командны запуска в таких случаях. Далее в эту директорию загружаем .bsp файлы из набора.

Также в стимворкшопе есть и куча одиночных карт с дополнительным сюжетом, также закидываете .bsp карты в директорию maps, загружаетесь через "map название_карты" и гоняете одиночные сюжетные дополнения.

P.S. также с другом можно в кооперативе проходить и основные одиночные карты, но это уже бред, т.к. получается слишком просто из-за того, что они рассчитаны на именно одного игрока, можете отдельно загуглить

## Где найти остальные команды

В вики от valve:
https://developer.valvesoftware.com/wiki/List_of_Portal_2_console_commands_and_variables

## 🕹️ Не могу переключить язык интерфейса в Portal 1 + Prelude

Если в сборке отсутствует возможность переключить язык интерфейса через Language Selector,
поэтому кому нужно - вручную можно изменить язык в:

      <Директория игры>\bin\steam_emu.ini

Или если играете через SandBoxie:

      <Директория с песочницей>\drive\<Диск>\<Директория игры>\bin\steam_emu.ini

Находим эти строчки:

      ### Name of the current player
      ###
      UserName=Ebby
      
      ### Language that will be used in the game
      ###
      Language=russian


Доступные языки интерфейса

      english=English
      russian=Русский
      bulgarian=Български
      danish=Dansk
      dutch=Dutch
      finnish=Suomi
      french=Francais
      german=Deutsch
      greek=Greek
      italian=Italiano
      japanese=Japanese
      koreana=Korean
      norwegian=Norsk
      polish=Polski
      hungarian=Magyar
      czech=Czech
      romanian=Romanian
      portuguese=Portuguese
      brazilian=Brazilian
      schinese=Chinese (simplifed)
      tchinese=Chinese (traditional)
      spanish=Espanol-Espana
      swedish=Svenska
      thai=Thai
      turkish=Turkish

## Как переключить язык озвучки в Portal 1 + Prelude
Открыть cmd в директории с игрой (можете перейти в неё через комнду

      cd <Полный путь до игры>)

Удалить русскую озвучу:

      mkdir bckp
      move portal\portal_sound_vo_russian_000.vpk bckp\portal_sound_vo_russian_000.vpk
      move portal\portal_sound_vo_russian_dir.vpk bckp\portal_sound_vo_russian_dir.vpk

Вернуть русскую озвучку:

      move bckp\portal_sound_vo_russian_000.vpk portal\portal_sound_vo_russian_000.vpk
      move bckp\portal_sound_vo_russian_dir.vpk portal\portal_sound_vo_russian_dir.vpk
      rd bckp /s /Q