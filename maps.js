// Кастомные карты
let wheatleysUnscientificTests =
    [
        'mymaps_wust1',
        'mymaps_wust2',
        'mymaps_wust3',
        'mymaps_wust4',
        'mymaps_wust5',
        'mymaps_wust6',
    ]

let coopMainChapters =
    {
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
    }

let coopRaptureMainMaps =
    [
        'mp_coop_marlow_udg_1', // Большая трудная скучная говнокарта
        'mp_coop_ion_juggle_5_b1',
        'mp_coop_ion_juggle_4_b2',
        'mp_coop_ion_juggle_3_b1',
        'mp_coop_ion_juggle_2_b4',
        'mp_coop_ion_juggle_1_b3',
        'mp_coop_ion_bridge_1_b1',
        'mp_coop_cube_collector',
        'mp_coop_discovery_03',
        'mp_coop_discovery_02',
        'mp_coop_crowd_race',
        'mp_coop_Cyan_industries',
        'mp_coop_split',
        'mp_coop_alternative_2',
        'mp_coop_discovery_01',
        'mp_coop_wheatley_platforms',
        'mp_coop_gauntlet',
        'mp_coop_hardbridge',
        'mp_coop_panels',
        'mp_coop_fateagle_1',
        'mp_coop_fateagle_2',
        'mp_coop_Cs70s',
        'mp_coop_illuminationblu1',
        'mp_coop_split',
        'mp_coop_rock_of_prometheus',
        'mp_coop_PortalCombat_01',
        'mp_coop_lasergame',
        'mp_coop_laserteamwork',
        'mp_coop_laserglasses',
        'mp_coop_inandout',
        'mp_coop_Dome_02',
        'mp_coop_blueblock1',
        'mp_coop_lifts',
        'mp_coop_teamwork1',
        'mp_coop_testchamber1',
        'mp_coop_thru_facility',
        'mp_coop_scooter',
        'mp_coop_ReduceReuseRefract',
        'mp_coop_eclectic_elements',
        'mp_coop_refraction',
        'mp_coop_because_im_a_potato',
        'mp_coop_hypercube',
        'mp_coop_compitition',
        'mp_coop_vertigo',
        'mp_coop_Retupmoc_Map',
        'mp_coop_chickentest_3',
        'mp_coop_newhole',
        'mp_coop_pokus01',
        'mp_coop_zeitgeist',
        'mp_coop_secleratus',
        'mp_coop_electrophobia',
        'mp_coop_lz-3',
        'mp_coop_jumpingjack',
        'mp_coop_JFL_Toxic_Funnel',
        'mp_coop_ice_three_cubes',
        'mp_coop_aristodemos',
        'mp_coop_the_way_of_the_turret',
        'mp_coop_they_still_apply',
        'mp_coop_paintmess',
        'mp_coop_a1_tc1',
        'mp_coop_kyo_01',
        'mp_coop_nameless_sphere',
        'mp_coop_versus',
        'mp_coop_laser_tower',
        'mp_coop_the-exit',
        'mp_coop_fastreflexes',
        'mp_coop_theBiggerPicture',
        'mp_coop_fast_bridge',
        'mp_coop_marlowalsdemo',
        'mp_coop_varietycoop_1',
        'mp_coop_site_e',
        'mp_coop_cube_travel',
        'mp_coop_fling_bridge',
        'mp_coop_The_Experience',
        'mp_coop_gear_redirections',
        'mp_coop_chamber_1',
        'mp_coop_wnbptw',
        'mp_coop_redalert',
        'mp_coop_example',
        'mp_coop_laser_trip',
        'mp_coop_evolution_n01_rc2',
        'mp_coop_alternative_1',
        'mp_coop_mindlock',
        'mp_coop_cubeget',
        'mp_coop_site_a',
        'mp_coop_site_b',
        'mp_coop_COLOURS',
        'mp_coop_fire_of_epimetheus',
        'mp_coop_axis_final',
        'mp_coop_explosive_1',
        'mp_coop_COLOURS3',
        'mp_coop_COLOURS2',
        'mp_coop_purgatorio_01',
        'mp_coop_first_try',
        'mp_coop_engineer',
        'mp_coop_sirbub_tbeams_01',
        'mp_coop_COLOURS4',
        'mp_coop_chickentest_2',
        'mp_coop_gelescape',
        'mp_coop_doors_v_1_03',
        'mp_coop_catapults_and_buttons',
        'mp_coop_Watson1',
        'mp_coop_gangster0t_chamber_1',
        'mp_coop_lazermaze_ljdp',
        'mp_coop_surprise1',
        'mp_coop_chickentest_1',
        'mp_coop_halls_of_menoetius',
        'mp_coop_lotsoffaith_ljdp',
        'mp_coop_boomer_1',
        'mp_coop_build_puzzle_one',
    ]

let coopRaptureSandboxiesMaps =
    [
        'mp_coop_tic_tac_toe',
        'mp_coop_football',
        'mp_coop_basketball',
        'mp_coop_playground',
        'mp_coop_high_jump_playground',
        'mp_coop_firelemons',
        'mp_coop_bowling',
        'mp_coop_funbox_v1',
        'mp_coop_playground_ice_b1',
        'mp_coop_portal_playground_v1_d',
    ]

let coopBeyondImagination =
    [
        'mymaps_mp_coop_theory-driven',
        'mymaps_mp_coop_beyound_imagination_1',
        'mymaps_mp_coop_beyound_imagination_2',
        'mymaps_mp_coop_beyound_imagination_3',
        'mymaps_mp_coop_beyound_imagination_4',
        'mymaps_mp_coop_beyound_imagination_5',
        'mymaps_mp_coop_beyound_imagination_6',
    ]

let coopElectrophobia =
    [
        'mymaps_mp_coop_electrophobia_01_v03',
        'mymaps_mp_coop_electrophobia_02_v03',
        'mymaps_mp_coop_electrophobia_03_v03',
    ]

let coopGelocityTimeTrial =
    [
        'mymaps_mp_coop_gelocity_1_v02',
        'mymaps_mp_coop_gelocity_2_v01',
        'mymaps_mp_coop_gelocity_3_v02',
    ]

let coopChickenTests =
    [
        'mymaps_mp_coop_chickentest_1',
        'mymaps_mp_coop_chickentest_2',
        'mymaps_mp_coop_chickentest_3',
    ]

let coopThisIsATeamWork =
    [
        'mymaps_titw_1',
        'mymaps_titw_2',
        'mymaps_titw_3',
        'mymaps_titw_4',
        'mymaps_titw_5',
        'mymaps_titw_6',

    ]

// Безумно сложные гонки наперегонки (в виде решения тестов, не бег)
let coopTheAmazingRace =
    [
        'mymaps_mp_coop_racers_1w',
        'mymaps_mp_coop_racers_2w',
        'mymaps_mp_coop_racers_3w',
    ]