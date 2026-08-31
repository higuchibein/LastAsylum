/**
 * Last Asylum Strategy Wiki - Event Power Analytics & Filtering Script (event_analytics.js)
 */

const EVENT_DATA_MASTER = {
  "title": "ラストアサイラム｜イベント戦力整理",
  "updatedDate": "2026.08.31 (8/31峡谷戦最新)",
  "description": "8/31峡谷戦リストから最新戦力を更新。分類は17M／14.5M基準で判定。",
  "summary": {
    "confirmedCount": 85,
    "levelEnteredCount": 84,
    "classifiedCount": 85
  },
  "members": [
    {
      "id": "member-1",
      "name": "ビスケット・オリバ",
      "level": 30,
      "firstFleetPower": 27940059,
      "firstFleetPowerFormatted": "27,940,059",
      "category": "① 自力＋援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-2",
      "name": "gozaru",
      "level": 30,
      "firstFleetPower": 21718292,
      "firstFleetPowerFormatted": "21,718,292",
      "category": "① 自力＋援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-3",
      "name": "大地・Daichi・",
      "level": 29,
      "firstFleetPower": 20805796,
      "firstFleetPowerFormatted": "20,805,796",
      "category": "① 自力＋援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-4",
      "name": "さく-Saku-",
      "level": 28,
      "firstFleetPower": 20519897,
      "firstFleetPowerFormatted": "20,519,897",
      "category": "① 自力＋援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-5",
      "name": "せいろんCeylon",
      "level": 28,
      "firstFleetPower": 19673035,
      "firstFleetPowerFormatted": "19,673,035",
      "category": "① 自力＋援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-6",
      "name": "DIONE",
      "level": 30,
      "firstFleetPower": 18341137,
      "firstFleetPowerFormatted": "18,341,137",
      "category": "② 自力クリア",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-7",
      "name": "akio",
      "level": 29,
      "firstFleetPower": 18131013,
      "firstFleetPowerFormatted": "18,131,013",
      "category": "② 自力クリア",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-8",
      "name": "寺尾akら",
      "level": 28,
      "firstFleetPower": 17760490,
      "firstFleetPowerFormatted": "17,760,490",
      "category": "② 自力クリア",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-9",
      "name": "サクサクッ",
      "level": 28,
      "firstFleetPower": 17315330,
      "firstFleetPowerFormatted": "17,315,330",
      "category": "② 自力クリア",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-10",
      "name": "たいす",
      "level": 29,
      "firstFleetPower": 17281020,
      "firstFleetPowerFormatted": "17,281,020",
      "category": "② 自力クリア",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-11",
      "name": "VikingKratosクラトス",
      "level": 28,
      "firstFleetPower": 16913067,
      "firstFleetPowerFormatted": "16,913,067",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-12",
      "name": "esméralda",
      "level": 29,
      "firstFleetPower": 16804505,
      "firstFleetPowerFormatted": "16,804,505",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-13",
      "name": "チョッパ",
      "level": 28,
      "firstFleetPower": 16693972,
      "firstFleetPowerFormatted": "16,693,972",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-14",
      "name": "Morrigan13",
      "level": 28,
      "firstFleetPower": 15912036,
      "firstFleetPowerFormatted": "15,912,036",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-15",
      "name": "Boric",
      "level": 28,
      "firstFleetPower": 15892326,
      "firstFleetPowerFormatted": "15,892,326",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-16",
      "name": "rinie",
      "level": 28,
      "firstFleetPower": 15707243,
      "firstFleetPowerFormatted": "15,707,243",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-17",
      "name": "さくらmsm",
      "level": 28,
      "firstFleetPower": 15607070,
      "firstFleetPowerFormatted": "15,607,070",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-18",
      "name": "GreekHunter",
      "level": 28,
      "firstFleetPower": 15428876,
      "firstFleetPowerFormatted": "15,428,876",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-19",
      "name": "Dariusダリヤ",
      "level": 30,
      "firstFleetPower": 15354488,
      "firstFleetPowerFormatted": "15,354,488",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-20",
      "name": "蟲士ギンコ",
      "level": 27,
      "firstFleetPower": 15276792,
      "firstFleetPowerFormatted": "15,276,792",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-21",
      "name": "ほに-Honi-",
      "level": 28,
      "firstFleetPower": 15269986,
      "firstFleetPowerFormatted": "15,269,986",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-22",
      "name": "Omi•メキシコ",
      "level": 28,
      "firstFleetPower": 15151330,
      "firstFleetPowerFormatted": "15,151,330",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-23",
      "name": "ナビすけ",
      "level": 29,
      "firstFleetPower": 15111899,
      "firstFleetPowerFormatted": "15,111,899",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-24",
      "name": "Enemyk1ller",
      "level": 28,
      "firstFleetPower": 14970062,
      "firstFleetPowerFormatted": "14,970,062",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-25",
      "name": "ぷぅ",
      "level": 27,
      "firstFleetPower": 14791782,
      "firstFleetPowerFormatted": "14,791,782",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-26",
      "name": "Ryu18",
      "level": 27,
      "firstFleetPower": 14784273,
      "firstFleetPowerFormatted": "14,784,273",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-27",
      "name": "LittleEvilClown",
      "level": 28,
      "firstFleetPower": 14588946,
      "firstFleetPowerFormatted": "14,588,946",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-28",
      "name": "potivech",
      "level": 28,
      "firstFleetPower": 14578281,
      "firstFleetPowerFormatted": "14,578,281",
      "category": "③ 援軍ありで挑戦",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-29",
      "name": "Noxinn",
      "level": 28,
      "firstFleetPower": 14179341,
      "firstFleetPowerFormatted": "14,179,341",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-30",
      "name": "とっとこペロ太郎-pero-",
      "level": 27,
      "firstFleetPower": 14102072,
      "firstFleetPowerFormatted": "14,102,072",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-31",
      "name": "くろぽめこ",
      "level": 29,
      "firstFleetPower": 14076534,
      "firstFleetPowerFormatted": "14,076,534",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-32",
      "name": "CIAO",
      "level": 28,
      "firstFleetPower": 13888135,
      "firstFleetPowerFormatted": "13,888,135",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-33",
      "name": "TuralBerserk",
      "level": 27,
      "firstFleetPower": 13861293,
      "firstFleetPowerFormatted": "13,861,293",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-34",
      "name": "ベインBein",
      "level": 27,
      "firstFleetPower": 13802212,
      "firstFleetPowerFormatted": "13,802,212",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-35",
      "name": "RayaMar",
      "level": 27,
      "firstFleetPower": 13729700,
      "firstFleetPowerFormatted": "13,729,700",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-36",
      "name": "DoctorKiriko",
      "level": 28,
      "firstFleetPower": 13659224,
      "firstFleetPowerFormatted": "13,659,224",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-37",
      "name": "Marie1980",
      "level": 27,
      "firstFleetPower": 13580300,
      "firstFleetPowerFormatted": "13,580,300",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-38",
      "name": "ツナ缶-TUNAKAN-",
      "level": 28,
      "firstFleetPower": 13371344,
      "firstFleetPowerFormatted": "13,371,344",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-39",
      "name": "なちゃん",
      "level": 28,
      "firstFleetPower": 13134885,
      "firstFleetPowerFormatted": "13,134,885",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-40",
      "name": "ninet",
      "level": 28,
      "firstFleetPower": 13020197,
      "firstFleetPowerFormatted": "13,020,197",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-41",
      "name": "courgettezuchini",
      "level": 25,
      "firstFleetPower": 12785695,
      "firstFleetPowerFormatted": "12,785,695",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-42",
      "name": "はむハム",
      "level": 26,
      "firstFleetPower": 12731200,
      "firstFleetPowerFormatted": "12,731,200",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-43",
      "name": "AzucenaNava",
      "level": 27,
      "firstFleetPower": 12673247,
      "firstFleetPowerFormatted": "12,673,247",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-44",
      "name": "Azaad",
      "level": 27,
      "firstFleetPower": 12583065,
      "firstFleetPowerFormatted": "12,583,065",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-45",
      "name": "Illyy52",
      "level": 27,
      "firstFleetPower": 12411896,
      "firstFleetPowerFormatted": "12,411,896",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-46",
      "name": "しずまま",
      "level": 26,
      "firstFleetPower": 12338764,
      "firstFleetPowerFormatted": "12,338,764",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-47",
      "name": "Blu3Raiju",
      "level": 27,
      "firstFleetPower": 12320452,
      "firstFleetPowerFormatted": "12,320,452",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-48",
      "name": "DrsMoochi",
      "level": 26,
      "firstFleetPower": 12319543,
      "firstFleetPowerFormatted": "12,319,543",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-49",
      "name": "Doctor3vZhOIUC",
      "level": 28,
      "firstFleetPower": 12130307,
      "firstFleetPowerFormatted": "12,130,307",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-50",
      "name": "ElVenexian85",
      "level": "-",
      "firstFleetPower": 12088684,
      "firstFleetPowerFormatted": "12,088,684",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-51",
      "name": "みっちょ☆",
      "level": 26,
      "firstFleetPower": 12079854,
      "firstFleetPowerFormatted": "12,079,854",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-52",
      "name": "SiBeL",
      "level": 27,
      "firstFleetPower": 11922087,
      "firstFleetPowerFormatted": "11,922,087",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-53",
      "name": "haya09",
      "level": 27,
      "firstFleetPower": 11850443,
      "firstFleetPowerFormatted": "11,850,443",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-54",
      "name": "Gяαciα",
      "level": 27,
      "firstFleetPower": 11835058,
      "firstFleetPowerFormatted": "11,835,058",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-55",
      "name": "ウォンカ",
      "level": 27,
      "firstFleetPower": 11579714,
      "firstFleetPowerFormatted": "11,579,714",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-56",
      "name": "かあたjr",
      "level": 27,
      "firstFleetPower": 11534387,
      "firstFleetPowerFormatted": "11,534,387",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-57",
      "name": "※☆※《KODAL》※☆※",
      "level": 27,
      "firstFleetPower": 11282980,
      "firstFleetPowerFormatted": "11,282,980",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-58",
      "name": "紅桜華",
      "level": 24,
      "firstFleetPower": 10456945,
      "firstFleetPowerFormatted": "10,456,945",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-59",
      "name": "ペコ。",
      "level": 27,
      "firstFleetPower": 10234286,
      "firstFleetPowerFormatted": "10,234,286",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-60",
      "name": "mo7a",
      "level": 25,
      "firstFleetPower": 10026491,
      "firstFleetPowerFormatted": "10,026,491",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-61",
      "name": "ススワタリ",
      "level": 27,
      "firstFleetPower": 9973328,
      "firstFleetPowerFormatted": "9,973,328",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-62",
      "name": "Tsuki-bee",
      "level": 26,
      "firstFleetPower": 9914242,
      "firstFleetPowerFormatted": "9,914,242",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-63",
      "name": "xxkkomiixx",
      "level": 26,
      "firstFleetPower": 9718623,
      "firstFleetPowerFormatted": "9,718,623",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-64",
      "name": "metafor",
      "level": 24,
      "firstFleetPower": 9633811,
      "firstFleetPowerFormatted": "9,633,811",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-65",
      "name": "ダークネスリユニオン",
      "level": 25,
      "firstFleetPower": 9504581,
      "firstFleetPowerFormatted": "9,504,581",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-66",
      "name": "もぐら12",
      "level": 26,
      "firstFleetPower": 8646562,
      "firstFleetPowerFormatted": "8,646,562",
      "category": "④ 燃焼後に援軍",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-67",
      "name": "SzeBen",
      "level": 29,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-68",
      "name": "SeniorDeath",
      "level": 28,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-69",
      "name": "ダーリンkeseLE",
      "level": 28,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-70",
      "name": "kasimmm1903",
      "level": 27,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-71",
      "name": "トレバー",
      "level": 27,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-72",
      "name": "aki000",
      "level": 26,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-73",
      "name": "strawberryBomber",
      "level": 26,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-74",
      "name": "Tsukune9",
      "level": 25,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-75",
      "name": "柳たかし",
      "level": 25,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-76",
      "name": "Barabasua",
      "level": 24,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-77",
      "name": "P-YA",
      "level": 24,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-78",
      "name": "キャベジン",
      "level": 24,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-79",
      "name": "ユリユリ",
      "level": 24,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-80",
      "name": "よしはる0729",
      "level": 23,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-81",
      "name": "めろめ",
      "level": 22,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-82",
      "name": "りりろず",
      "level": 22,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-83",
      "name": "mimi1997",
      "level": 20,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-84",
      "name": "むすみ",
      "level": 19,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    },
    {
      "id": "member-85",
      "name": "花音BLUE",
      "level": 15,
      "firstFleetPower": 0,
      "firstFleetPowerFormatted": "-",
      "category": "未判定",
      "secondHelp": "-",
      "thirdHelp": "-"
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const allMembers = EVENT_DATA_MASTER.members || [];

  const searchInput = document.getElementById('event-search-input');
  const catFilter = document.getElementById('event-cat-filter');
  const sortSelect = document.getElementById('event-sort-select');
  const resultCount = document.getElementById('event-result-count');
  const gridContainer = document.getElementById('event-members-grid');

  const exportTextBtn = document.getElementById('export-text-btn');
  const exportCsvBtn = document.getElementById('export-csv-btn');

  // Initialize Chart.js Graphs safely
  setTimeout(() => {
    try { initCharts(); } catch (e) { console.error('Chart init error:', e); }
  }, 50);

  // Filter & Sort Event Handlers
  function filterAndSortCards() {
    if (!gridContainer) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const catVal = catFilter ? catFilter.value : 'all';
    const sortVal = sortSelect ? sortSelect.value : 'power-desc';

    const cards = Array.from(gridContainer.children);
    let visibleCount = 0;

    cards.forEach(card => {
      const name = (card.getAttribute('data-name') || '').toLowerCase();
      const cat = card.getAttribute('data-category') || '';
      const cardText = card.textContent.toLowerCase();

      let matchCat = true;
      if (catVal === 'has-help') {
        matchCat = cardText.includes('ヘルプ:');
      } else if (catVal !== 'all') {
        matchCat = cat.includes(catVal);
      }

      let matchSearch = !query || cardText.includes(query) || name.includes(query);

      if (matchCat && matchSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultCount) {
      resultCount.textContent = `表示人数: ${visibleCount}名 (全${cards.length}名中)`;
    }

    // Re-sort DOM Cards
    const visibleCards = cards.filter(c => c.style.display !== 'none');
    visibleCards.sort((a, b) => {
      const pA = parseInt(a.getAttribute('data-power') || '0', 10);
      const pB = parseInt(b.getAttribute('data-power') || '0', 10);
      const lA = parseInt(a.getAttribute('data-level') || '0', 10);
      const lB = parseInt(b.getAttribute('data-level') || '0', 10);
      const nA = a.getAttribute('data-name') || '';
      const nB = b.getAttribute('data-name') || '';

      if (sortVal === 'power-desc') return pB - pA;
      if (sortVal === 'power-asc') return pA - pB;
      if (sortVal === 'level-desc') return lB - lA;
      if (sortVal === 'name-asc') return nA.localeCompare(nB, 'ja');
      return 0;
    });

    visibleCards.forEach(card => gridContainer.appendChild(card));
  }

  if (searchInput) searchInput.addEventListener('input', filterAndSortCards);
  if (catFilter) catFilter.addEventListener('change', filterAndSortCards);
  if (sortSelect) sortSelect.addEventListener('change', filterAndSortCards);

  // --- Chart Rendering ---
  function initCharts() {
    if (!allMembers.length || typeof Chart === 'undefined') return;

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // Chart 1: Category
    const catCanvas = document.getElementById('categoryChart');
    if (catCanvas) {
      const catCounts = {
        '① 自力＋援軍': 0,
        '② 自力クリア': 0,
        '③ 援軍ありで挑戦': 0,
        'その他 / 未分類': 0
      };

      allMembers.forEach(m => {
        if (m.category && m.category.includes('①')) catCounts['① 自力＋援軍']++;
        else if (m.category && m.category.includes('②')) catCounts['② 自力クリア']++;
        else if (m.category && m.category.includes('③')) catCounts['③ 援軍ありで挑戦']++;
        else catCounts['その他 / 未分類']++;
      });

      new Chart(catCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: Object.keys(catCounts),
          datasets: [{
            data: Object.values(catCounts),
            backgroundColor: ['#ffd700', '#00f0ff', '#ff9f43', '#546e7a'],
            borderColor: '#131722',
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
        }
      });
    }

    // Chart 2: Level
    const lvCanvas = document.getElementById('levelChart');
    if (lvCanvas) {
      const lvCounts = { 'Lv.30': 0, 'Lv.29': 0, 'Lv.28': 0, 'Lv.27以下': 0, '未確認': 0 };
      allMembers.forEach(m => {
        const lv = parseInt(m.level, 10);
        if (lv === 30) lvCounts['Lv.30']++;
        else if (lv === 29) lvCounts['Lv.29']++;
        else if (lv === 28) lvCounts['Lv.28']++;
        else if (lv > 0 && lv < 28) lvCounts['Lv.27以下']++;
        else lvCounts['未確認']++;
      });

      new Chart(lvCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: Object.keys(lvCounts),
          datasets: [{
            label: '人数 (名)',
            data: Object.values(lvCounts),
            backgroundColor: '#00f0ff',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Chart 3: Top 15
    const topCanvas = document.getElementById('topPowerChart');
    if (topCanvas) {
      const sortedMembers = [...allMembers].sort((a, b) => b.firstFleetPower - a.firstFleetPower);
      const top15 = sortedMembers.slice(0, 15);

      new Chart(topCanvas.getContext('2d'), {
        type: 'bar',
        data: {
          labels: top15.map(m => m.name),
          datasets: [{
            label: '一軍戦力',
            data: top15.map(m => m.firstFleetPower),
            backgroundColor: (ctx) => {
              const idx = ctx.dataIndex;
              if (idx === 0) return '#ffd700';
              if (idx === 1) return '#e0e0e0';
              if (idx === 2) return '#cd7f32';
              return '#0099b8';
            },
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { grid: { display: false } }
          }
        }
      });
    }
  }

  // Exports
  if (exportTextBtn) {
    exportTextBtn.addEventListener('click', () => {
      let text = `【Last Asylum 8/31 峡谷戦イベント戦力一覧】
確認人数: ${allMembers.length}名

`;
      allMembers.forEach((m, i) => {
        text += `${i+1}. ${m.name} | Lv.${m.level} | 戦力: ${m.firstFleetPowerFormatted} | ${m.category}
`;
      });
      window.copyToClipboard(text, '戦力一覧テキストをコピーしました！');
    });
  }

  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      let csvStr = "﻿メンバー名,レベル,一軍戦力,分類,2軍ヘルプ先,3軍ヘルプ先
";
      allMembers.forEach(m => {
        csvStr += `"${m.name}","${m.level}","${m.firstFleetPower}","${m.category}","${m.secondHelp}","${m.thirdHelp}"
`;
      });

      const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LastAsylum_EventPower_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      window.showToast('CSVファイルをダウンロードしました！');
    });
  }
});
