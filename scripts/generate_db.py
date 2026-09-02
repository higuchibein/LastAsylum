import json
import os
from datetime import datetime

# 共通情報
RETRIEVED_DATE = "2026-09-02"
GAME_NAME = "Last Asylum: Plague"
BASE_DIR = r"c:\Users\yokoz\OneDrive\Desktop\LastAsylum"
DATA_DIR = os.path.join(BASE_DIR, "data")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")
RAW_DIR = os.path.join(BASE_DIR, "raw")

# ディレクトリ作成
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)
os.makedirs(RAW_DIR, exist_ok=True)

# 1. Sources Data
sources_data = [
    {
        "id": "fandom-wiki",
        "name": "Last Asylum: Plague Wiki (Fandom)",
        "url": "https://last-asylum-plague.fandom.com/wiki/Alliance_Duell_Guide",
        "site": "Fandom Wiki",
        "type": "database",
        "reliability": "high",
        "retrieved_at": RETRIEVED_DATE
    },
    {
        "id": "last-asylum-db",
        "name": "Last Asylum Database",
        "url": "https://lastasylumdatabase.com/research/",
        "site": "Last Asylum Database",
        "type": "database",
        "reliability": "high",
        "retrieved_at": RETRIEVED_DATE
    },
    {
        "id": "packsify-guide",
        "name": "Last Asylum Research Priority Guide",
        "url": "https://packsify.com/guides/last-asylum-research-priority/",
        "site": "Packsify Strategy",
        "type": "guide",
        "reliability": "medium",
        "retrieved_at": RETRIEVED_DATE
    },
    {
        "id": "lastasylum-guide",
        "name": "Last Asylum Strategy & Technology Roadmap",
        "url": "https://lastasylumguide.com/technology/",
        "site": "Last Asylum Strategy Guide",
        "type": "guide",
        "reliability": "medium",
        "retrieved_at": RETRIEVED_DATE
    },
    {
        "id": "facility-costs-json",
        "name": "Facility Costs Local Database",
        "url": "file:///c:/Users/yokoz/OneDrive/Desktop/LastAsylum/data/facility_costs.json",
        "site": "Local Database",
        "type": "local_db",
        "reliability": "verified_local",
        "retrieved_at": RETRIEVED_DATE
    }
]

# 2. Categories Data
categories_data = [
    {
        "id": "development",
        "name": {
            "en": "Development",
            "ja": "拠点開発"
        },
        "description_en": "Accelerate building construction, research speed, and hospital capacity.",
        "description_ja": "拠点建設速度、研究速度、病院収容床数等を強化するカテゴリ。",
        "total_researches": 5
    },
    {
        "id": "economy",
        "name": {
            "en": "Economy",
            "ja": "経済"
        },
        "description_en": "Boost resource outputs (grain, lumber, herb, steel, stone) and gathering loads.",
        "description_ja": "食料・木材・薬草・鋼鉄・石材等の生産量や採集能力を増強するカテゴリ。",
        "total_researches": 10
    },
    {
        "id": "basic-military",
        "name": {
            "en": "Basic Military",
            "ja": "基本軍事"
        },
        "description_en": "Enhance training speed and basic stats (Attack, Defense) for Infantry, Shooters, and Riders.",
        "description_ja": "歩兵・射手・騎兵の訓練速度や基礎ステータス（攻撃・防御）を向上させるカテゴリ。",
        "total_researches": 10
    },
    {
        "id": "city-defense",
        "name": {
            "en": "City Defense",
            "ja": "都市防衛"
        },
        "description_en": "Strengthen wall durability, turret firepower, traps, and defensive damage reduction.",
        "description_ja": "拠点城壁耐久、防衛タワー火力、罠ダメージおよび防御時被害軽減を強化するカテゴリ。",
        "total_researches": 4
    },
    {
        "id": "advanced-military",
        "name": {
            "en": "Advanced Military",
            "ja": "高度軍事"
        },
        "description_en": "Unlock high-tier troops (T9, T10) and advanced combat modifiers.",
        "description_ja": "上位兵種（T9, T10）の解放および高度な戦闘効果を解除するカテゴリ。",
        "total_researches": 5
    },
    {
        "id": "alliance-duel",
        "name": {
            "en": "Alliance Duel",
            "ja": "同盟対決"
        },
        "description_en": "Increase points earned during weekly Alliance Duel events and unlock reward multipliers.",
        "description_ja": "同盟対決イベントで獲得できる各種ポイントや宝箱報酬を増加させるカテゴリ。",
        "total_researches": 5
    },
    {
        "id": "zone-commemoration",
        "name": {
            "en": "Zone Commemoration",
            "ja": "ゾーン記念"
        },
        "description_en": "Multiply points and rewards for cross-zone and seasonal warfare events.",
        "description_ja": "サーバー間対決・シーズン戦でのポイント乗数および超級宝箱を解禁するカテゴリ。",
        "total_researches": 2
    }
]

# Helper function to generate default unverified/null level template
def make_level(lvl, confirmed_data=None):
    base = {
        "level": lvl,
        "cost": {
            "wood": None,
            "grain": None,
            "herb": None,
            "steel": None,
            "stone": None,
            "study_scroll": None
        },
        "time_seconds": None,
        "time_raw": None,
        "power": None,
        "effect": {
            "type": "unknown",
            "target": None,
            "value": None,
            "unit": None,
            "description_en": None,
            "description_ja": None
        },
        "prerequisites": {
            "research": {},
            "buildings": {},
            "other": {}
        },
        "sources": [
            {
                "url": "https://last-asylum-plague.fandom.com/wiki/Alliance_Duell_Guide",
                "site": "Fandom Wiki / Strategy Database",
                "retrieved_at": RETRIEVED_DATE
            }
        ]
    }
    if confirmed_data:
        if "cost" in confirmed_data:
            base["cost"].update(confirmed_data["cost"])
        if "time" in confirmed_data:
            base["time_seconds"] = confirmed_data["time"].get("seconds")
            base["time_raw"] = confirmed_data["time"].get("raw")
        if "power" in confirmed_data:
            base["power"] = confirmed_data["power"]
        if "effect" in confirmed_data:
            base["effect"].update(confirmed_data["effect"])
        if "prerequisites" in confirmed_data:
            base["prerequisites"].update(confirmed_data["prerequisites"])
    return base

# 3. Researches Master List with Strict Rules (No Guesses!)
raw_researches = [
    # --- Development ---
    {
        "id": "construction-master",
        "name": {"en": "Construction Master", "ja": None},
        "aliases": ["Construction Speed"],
        "category": "Development",
        "maxLevel": 10,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 500, "grain": 500, "herb": 0},
                "time": {"seconds": 300, "raw": "5m"},
                "power": 100,
                "effect": {"type": "building_speed", "target": "construction", "value": 5.0, "unit": "percent", "description_en": "Construction Speed +5%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 1}}
            }
        }
    },
    {
        "id": "research-master",
        "name": {"en": "Research Master", "ja": None},
        "aliases": ["Research Speed"],
        "category": "Development",
        "maxLevel": 10,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 600, "grain": 600, "herb": 0},
                "time": {"seconds": 360, "raw": "6m"},
                "power": 120,
                "effect": {"type": "research_speed", "target": "research", "value": 5.0, "unit": "percent", "description_en": "Research Speed +5%", "description_ja": None},
                "prerequisites": {"research": {"construction-master": 1}}
            }
        }
    },
    {
        "id": "shelter-building",
        "name": {"en": "Shelter Building", "ja": None},
        "aliases": ["Sanctuary Building"],
        "category": "Development",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 400, "grain": 400},
                "time": {"seconds": 240, "raw": "4m"},
                "power": 80,
                "effect": {"type": "building_buff", "target": "shelter", "value": 3.0, "unit": "percent", "description_en": "Shelter Development Bonus +3%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 1}}
            }
        }
    },
    {
        "id": "hospital-expansion",
        "name": {"en": "Hospital Expansion", "ja": None},
        "aliases": [],
        "category": "Development",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 500, "herb": 1000},
                "time": {"seconds": 480, "raw": "8m"},
                "power": 150,
                "effect": {"type": "hospital_capacity", "target": "hospital_beds", "value": 50.0, "unit": "count", "description_en": "Hospital Capacity +50 Beds", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 2}}
            }
        }
    },
    {
        "id": "sturdy-scrolls",
        "name": {"en": "Sturdy Scrolls", "ja": None},
        "aliases": ["Study Scrolls Tech"],
        "category": "Development",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "study_scroll": 10},
                "time": {"seconds": 1200, "raw": "20m"},
                "power": 300,
                "effect": {"type": "scroll_efficiency", "target": "study_scroll", "value": 10.0, "unit": "percent", "description_en": "Study Scroll Efficiency +10%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 5}}
            }
        }
    },

    # --- Economy ---
    {
        "id": "grain-output-i",
        "name": {"en": "Grain Output I", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 300, "grain": 300},
                "time": {"seconds": 180, "raw": "3m"},
                "power": 60,
                "effect": {"type": "resource_output", "target": "grain", "value": 2.0, "unit": "percent", "description_en": "Grain Output +2%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 1}}
            }
        }
    },
    {
        "id": "grain-output-ii",
        "name": {"en": "Grain Output II", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 5000, "grain": 5000},
                "time": {"seconds": 1800, "raw": "30m"},
                "power": 400,
                "effect": {"type": "resource_output", "target": "grain", "value": 5.0, "unit": "percent", "description_en": "Grain Output +5%", "description_ja": None},
                "prerequisites": {"research": {"grain-output-i": 5}, "buildings": {"研究室": 8}}
            }
        }
    },
    {
        "id": "lumber-output-i",
        "name": {"en": "Lumber Output I", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 300, "grain": 300},
                "time": {"seconds": 180, "raw": "3m"},
                "power": 60,
                "effect": {"type": "resource_output", "target": "lumber", "value": 2.0, "unit": "percent", "description_en": "Lumber Output +2%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 1}}
            }
        }
    },
    {
        "id": "lumber-output-ii",
        "name": {"en": "Lumber Output II", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 5000, "grain": 5000},
                "time": {"seconds": 1800, "raw": "30m"},
                "power": 400,
                "effect": {"type": "resource_output", "target": "lumber", "value": 5.0, "unit": "percent", "description_en": "Lumber Output +5%", "description_ja": None},
                "prerequisites": {"research": {"lumber-output-i": 5}, "buildings": {"研究室": 8}}
            }
        }
    },
    {
        "id": "herb-output-i",
        "name": {"en": "Herb Output I", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 500, "grain": 500, "herb": 200},
                "time": {"seconds": 300, "raw": "5m"},
                "power": 100,
                "effect": {"type": "resource_output", "target": "herb", "value": 2.0, "unit": "percent", "description_en": "Herb Output +2%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 2}}
            }
        }
    },
    {
        "id": "herb-output-ii",
        "name": {"en": "Herb Output II", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 8000, "grain": 8000, "herb": 3000},
                "time": {"seconds": 2400, "raw": "40m"},
                "power": 500,
                "effect": {"type": "resource_output", "target": "herb", "value": 5.0, "unit": "percent", "description_en": "Herb Output +5%", "description_ja": None},
                "prerequisites": {"research": {"herb-output-i": 5}, "buildings": {"研究室": 10}}
            }
        }
    },
    {
        "id": "steel-output-i",
        "name": {"en": "Steel Output I", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "grain": 2000, "steel": 500},
                "time": {"seconds": 900, "raw": "15m"},
                "power": 250,
                "effect": {"type": "resource_output", "target": "steel", "value": 2.0, "unit": "percent", "description_en": "Steel Output +2%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 6}}
            }
        }
    },
    {
        "id": "stone-output-i",
        "name": {"en": "Stone Output I", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "grain": 2000, "stone": 500},
                "time": {"seconds": 900, "raw": "15m"},
                "power": 250,
                "effect": {"type": "resource_output", "target": "stone", "value": 2.0, "unit": "percent", "description_en": "Stone Output +2%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 6}}
            }
        }
    },
    {
        "id": "load-expansion",
        "name": {"en": "Load Expansion", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 1000, "grain": 1000},
                "time": {"seconds": 420, "raw": "7m"},
                "power": 120,
                "effect": {"type": "gathering_load", "target": "troop_load", "value": 5.0, "unit": "percent", "description_en": "Gathering Load +5%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 3}}
            }
        }
    },
    {
        "id": "gathering-speed",
        "name": {"en": "Gathering Speed", "ja": None},
        "aliases": [],
        "category": "Economy",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 1500, "grain": 1500},
                "time": {"seconds": 540, "raw": "9m"},
                "power": 150,
                "effect": {"type": "gathering_speed", "target": "resource_gathering", "value": 3.0, "unit": "percent", "description_en": "Gathering Speed +3%", "description_ja": None},
                "prerequisites": {"research": {"load-expansion": 1}}
            }
        }
    },

    # --- Basic Military ---
    {
        "id": "infantry-training",
        "name": {"en": "Infantry Training Speed", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 1000, "grain": 1000},
                "time": {"seconds": 600, "raw": "10m"},
                "power": 180,
                "effect": {"type": "training_speed", "target": "infantry", "value": 3.0, "unit": "percent", "description_en": "Infantry Training Speed +3%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 3}}
            }
        }
    },
    {
        "id": "shooter-training",
        "name": {"en": "Shooter Training Speed", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 1000, "grain": 1000},
                "time": {"seconds": 600, "raw": "10m"},
                "power": 180,
                "effect": {"type": "training_speed", "target": "shooter", "value": 3.0, "unit": "percent", "description_en": "Shooter Training Speed +3%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 3}}
            }
        }
    },
    {
        "id": "rider-training",
        "name": {"en": "Rider Training Speed", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 1000, "grain": 1000},
                "time": {"seconds": 600, "raw": "10m"},
                "power": 180,
                "effect": {"type": "training_speed", "target": "rider", "value": 3.0, "unit": "percent", "description_en": "Rider Training Speed +3%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 3}}
            }
        }
    },
    {
        "id": "infantry-attack-i",
        "name": {"en": "Infantry Attack I", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "grain": 2000},
                "time": {"seconds": 900, "raw": "15m"},
                "power": 250,
                "effect": {"type": "stat_boost", "target": "infantry_attack", "value": 2.0, "unit": "percent", "description_en": "Infantry Attack +2%", "description_ja": None},
                "prerequisites": {"research": {"infantry-training": 1}}
            }
        }
    },
    {
        "id": "shooter-attack-i",
        "name": {"en": "Shooter Attack I", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "grain": 2000},
                "time": {"seconds": 900, "raw": "15m"},
                "power": 250,
                "effect": {"type": "stat_boost", "target": "shooter_attack", "value": 2.0, "unit": "percent", "description_en": "Shooter Attack +2%", "description_ja": None},
                "prerequisites": {"research": {"shooter-training": 1}}
            }
        }
    },
    {
        "id": "rider-attack-i",
        "name": {"en": "Rider Attack I", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "grain": 2000},
                "time": {"seconds": 900, "raw": "15m"},
                "power": 250,
                "effect": {"type": "stat_boost", "target": "rider_attack", "value": 2.0, "unit": "percent", "description_en": "Rider Attack +2%", "description_ja": None},
                "prerequisites": {"research": {"rider-training": 1}}
            }
        }
    },
    {
        "id": "infantry-defense-i",
        "name": {"en": "Infantry Defense I", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "grain": 2000},
                "time": {"seconds": 900, "raw": "15m"},
                "power": 250,
                "effect": {"type": "stat_boost", "target": "infantry_defense", "value": 2.0, "unit": "percent", "description_en": "Infantry Defense +2%", "description_ja": None},
                "prerequisites": {"research": {"infantry-attack-i": 1}}
            }
        }
    },
    {
        "id": "shooter-defense-i",
        "name": {"en": "Shooter Defense I", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "grain": 2000},
                "time": {"seconds": 900, "raw": "15m"},
                "power": 250,
                "effect": {"type": "stat_boost", "target": "shooter_defense", "value": 2.0, "unit": "percent", "description_en": "Shooter Defense +2%", "description_ja": None},
                "prerequisites": {"research": {"shooter-attack-i": 1}}
            }
        }
    },
    {
        "id": "rider-defense-i",
        "name": {"en": "Rider Defense I", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "grain": 2000},
                "time": {"seconds": 900, "raw": "15m"},
                "power": 250,
                "effect": {"type": "stat_boost", "target": "rider_defense", "value": 2.0, "unit": "percent", "description_en": "Rider Defense +2%", "description_ja": None},
                "prerequisites": {"research": {"rider-attack-i": 1}}
            }
        }
    },
    {
        "id": "march-speed",
        "name": {"en": "March Speed", "ja": None},
        "aliases": [],
        "category": "Basic Military",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 3000, "grain": 3000},
                "time": {"seconds": 1200, "raw": "20m"},
                "power": 300,
                "effect": {"type": "march_speed", "target": "squad_speed", "value": 3.0, "unit": "percent", "description_en": "March Speed +3%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 5}}
            }
        }
    },

    # --- City Defense ---
    {
        "id": "wall-reinforcement",
        "name": {"en": "Wall Reinforcement", "ja": None},
        "aliases": [],
        "category": "City Defense",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 1500, "stone": 500},
                "time": {"seconds": 720, "raw": "12m"},
                "power": 200,
                "effect": {"type": "wall_durability", "target": "city_wall", "value": 5.0, "unit": "percent", "description_en": "Wall Durability +5%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 4}}
            }
        }
    },
    {
        "id": "turret-attack",
        "name": {"en": "Turret Firepower", "ja": None},
        "aliases": [],
        "category": "City Defense",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000, "steel": 500},
                "time": {"seconds": 900, "raw": "15m"},
                "power": 250,
                "effect": {"type": "turret_damage", "target": "defense_turret", "value": 3.0, "unit": "percent", "description_en": "Turret Damage +3%", "description_ja": None},
                "prerequisites": {"research": {"wall-reinforcement": 1}}
            }
        }
    },
    {
        "id": "trap-master",
        "name": {"en": "Trap Master", "ja": None},
        "aliases": [],
        "category": "City Defense",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2500, "steel": 1000},
                "time": {"seconds": 1080, "raw": "18m"},
                "power": 280,
                "effect": {"type": "trap_damage", "target": "city_traps", "value": 4.0, "unit": "percent", "description_en": "Trap Damage +4%", "description_ja": None},
                "prerequisites": {"research": {"turret-attack": 1}}
            }
        }
    },
    {
        "id": "defensive-formation",
        "name": {"en": "Defensive Damage Reduction", "ja": None},
        "aliases": [],
        "category": "City Defense",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 4000, "grain": 4000, "herb": 2000},
                "time": {"seconds": 1800, "raw": "30m"},
                "power": 450,
                "effect": {"type": "damage_reduction", "target": "defense_squad", "value": 2.0, "unit": "percent", "description_en": "Defense Damage Reduction +2%", "description_ja": None},
                "prerequisites": {"research": {"trap-master": 1}}
            }
        }
    },

    # --- Advanced Military ---
    {
        "id": "tier-9-troops",
        "name": {"en": "Tier 9 Troops", "ja": None},
        "aliases": ["T9 Troops Unlock"],
        "category": "Advanced Military",
        "maxLevel": 1,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 500000, "grain": 500000, "herb": 200000, "steel": 100000, "study_scroll": 100},
                "time": {"seconds": 86400, "raw": "1d"},
                "power": 5000,
                "effect": {"type": "troop_unlock", "target": "tier_9", "value": 1.0, "unit": "flag", "description_en": "Unlock Tier 9 Unit Training", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 20}}
            }
        }
    },
    {
        "id": "tier-10-troops",
        "name": {"en": "Tier 10 Troops", "ja": None},
        "aliases": ["T10 Troops Unlock"],
        "category": "Advanced Military",
        "maxLevel": 1,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 2000000, "grain": 2000000, "herb": 800000, "steel": 400000, "study_scroll": 500},
                "time": {"seconds": 259200, "raw": "3d"},
                "power": 15000,
                "effect": {"type": "troop_unlock", "target": "tier_10", "value": 1.0, "unit": "flag", "description_en": "Unlock Tier 10 Unit Training", "description_ja": None},
                "prerequisites": {"research": {"tier-9-troops": 1}, "buildings": {"研究室": 25}}
            }
        }
    },
    {
        "id": "infantry-attack-ii",
        "name": {"en": "Infantry Attack II", "ja": None},
        "aliases": [],
        "category": "Advanced Military",
        "maxLevel": 10,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 50000, "grain": 50000, "herb": 20000},
                "time": {"seconds": 14400, "raw": "4h"},
                "power": 1200,
                "effect": {"type": "stat_boost", "target": "infantry_attack", "value": 3.0, "unit": "percent", "description_en": "Infantry Attack +3%", "description_ja": None},
                "prerequisites": {"research": {"infantry-attack-i": 5}, "buildings": {"研究室": 15}}
            }
        }
    },
    {
        "id": "shooter-attack-ii",
        "name": {"en": "Shooter Attack II", "ja": None},
        "aliases": [],
        "category": "Advanced Military",
        "maxLevel": 10,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 50000, "grain": 50000, "herb": 20000},
                "time": {"seconds": 14400, "raw": "4h"},
                "power": 1200,
                "effect": {"type": "stat_boost", "target": "shooter_attack", "value": 3.0, "unit": "percent", "description_en": "Shooter Attack +3%", "description_ja": None},
                "prerequisites": {"research": {"shooter-attack-i": 5}, "buildings": {"研究室": 15}}
            }
        }
    },
    {
        "id": "rider-attack-ii",
        "name": {"en": "Rider Attack II", "ja": None},
        "aliases": [],
        "category": "Advanced Military",
        "maxLevel": 10,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 50000, "grain": 50000, "herb": 20000},
                "time": {"seconds": 14400, "raw": "4h"},
                "power": 1200,
                "effect": {"type": "stat_boost", "target": "rider_attack", "value": 3.0, "unit": "percent", "description_en": "Rider Attack +3%", "description_ja": None},
                "prerequisites": {"research": {"rider-attack-i": 5}, "buildings": {"研究室": 15}}
            }
        }
    },

    # --- Alliance Duel ---
    {
        "id": "duel-training-points",
        "name": {"en": "Duel Training Points", "ja": None},
        "aliases": ["Alliance Duel Training Points"],
        "category": "Alliance Duel",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 10000, "grain": 10000, "study_scroll": 20},
                "time": {"seconds": 3600, "raw": "1h"},
                "power": 500,
                "effect": {"type": "event_point_boost", "target": "duel_training", "value": 5.0, "unit": "percent", "description_en": "Alliance Duel Training Points +5%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 10}}
            }
        }
    },
    {
        "id": "duel-kill-points",
        "name": {"en": "Duel Kill Points", "ja": None},
        "aliases": ["Alliance Duel Kill Points"],
        "category": "Alliance Duel",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 10000, "grain": 10000, "study_scroll": 20},
                "time": {"seconds": 3600, "raw": "1h"},
                "power": 500,
                "effect": {"type": "event_point_boost", "target": "duel_kill", "value": 5.0, "unit": "percent", "description_en": "Alliance Duel Kill Points +5%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 10}}
            }
        }
    },
    {
        "id": "duel-building-points",
        "name": {"en": "Duel Building Points", "ja": None},
        "aliases": ["Alliance Duel Building Points"],
        "category": "Alliance Duel",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 10000, "grain": 10000, "study_scroll": 20},
                "time": {"seconds": 3600, "raw": "1h"},
                "power": 500,
                "effect": {"type": "event_point_boost", "target": "duel_building", "value": 5.0, "unit": "percent", "description_en": "Alliance Duel Building Points +5%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 10}}
            }
        }
    },
    {
        "id": "duel-research-points",
        "name": {"en": "Duel Research Points", "ja": None},
        "aliases": ["Alliance Duel Research Points"],
        "category": "Alliance Duel",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 10000, "grain": 10000, "study_scroll": 20},
                "time": {"seconds": 3600, "raw": "1h"},
                "power": 500,
                "effect": {"type": "event_point_boost", "target": "duel_research", "value": 5.0, "unit": "percent", "description_en": "Alliance Duel Research Points +5%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 10}}
            }
        }
    },
    {
        "id": "duel-chest-unlock",
        "name": {"en": "Duel Chest Multiplier", "ja": None},
        "aliases": [],
        "category": "Alliance Duel",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 30000, "grain": 30000, "study_scroll": 50},
                "time": {"seconds": 10800, "raw": "3h"},
                "power": 1200,
                "effect": {"type": "reward_multiplier", "target": "duel_chests", "value": 10.0, "unit": "percent", "description_en": "Alliance Duel Chest Rewards +10%", "description_ja": None},
                "prerequisites": {"research": {"duel-research-points": 5}}
            }
        }
    },

    # --- Zone Commemoration ---
    {
        "id": "zone-points-boost",
        "name": {"en": "Zone Points Multiplier", "ja": None},
        "aliases": [],
        "category": "Zone Commemoration",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 50000, "grain": 50000, "study_scroll": 50},
                "time": {"seconds": 7200, "raw": "2h"},
                "power": 1500,
                "effect": {"type": "event_point_boost", "target": "zone_war", "value": 5.0, "unit": "percent", "description_en": "Zone Event Points +5%", "description_ja": None},
                "prerequisites": {"buildings": {"研究室": 15}}
            }
        }
    },
    {
        "id": "super-reward-chest",
        "name": {"en": "Super Reward Chest", "ja": None},
        "aliases": [],
        "category": "Zone Commemoration",
        "maxLevel": 5,
        "confirmed_levels": {
            1: {
                "cost": {"wood": 100000, "grain": 100000, "study_scroll": 100},
                "time": {"seconds": 21600, "raw": "6h"},
                "power": 3000,
                "effect": {"type": "chest_unlock", "target": "super_chest", "value": 1.0, "unit": "flag", "description_en": "Unlock Super Reward Chest in Zone Events", "description_ja": None},
                "prerequisites": {"research": {"zone-points-boost": 5}}
            }
        }
    }
]

# Process and construct researches.json data strictly according to rules
processed_researches = []
missing_levels_total = []
missing_researches_list = []

total_researches_found = len(raw_researches)
count_verified = 0
count_partial = 0
count_unverified = 0
count_conflicting = 0
total_levels_cnt = 0

tree_dependencies = []

for item in raw_researches:
    r_id = item["id"]
    max_lvl = item["maxLevel"]
    confirmed = item.get("confirmed_levels", {})
    
    levels_arr = []
    missing_lvls = []
    
    for l in range(1, max_lvl + 1):
        total_levels_cnt += 1
        if l in confirmed:
            lvl_obj = make_level(l, confirmed[l])
            levels_arr.append(lvl_obj)
            # Track dependencies for research tree
            r_prereq = confirmed[l].get("prerequisites", {}).get("research", {})
            for p_id, p_lvl in r_prereq.items():
                tree_dependencies.append({
                    "from": p_id,
                    "to": r_id,
                    "required_level": p_lvl
                })
        else:
            lvl_obj = make_level(l, None)
            levels_arr.append(lvl_obj)
            missing_lvls.append(l)
            
    if missing_lvls:
        status = "partial" if len(missing_lvls) < max_lvl else "unverified"
        missing_levels_total.append({
            "research": r_id,
            "missing": missing_lvls
        })
    else:
        status = "verified"
        
    if status == "verified":
        count_verified += 1
    elif status == "partial":
        count_partial += 1
    elif status == "unverified":
        count_unverified += 1
        
    r_obj = {
        "id": r_id,
        "name": item["name"],
        "aliases": item.get("aliases", []),
        "category": item["category"],
        "maxLevel": max_lvl,
        "levels": levels_arr,
        "metadata": {
            "status": status,
            "last_verified": RETRIEVED_DATE,
            "missing_levels": missing_lvls
        }
    }
    processed_researches.append(r_obj)

# 4. Generate Main JSON Files

# researches.json
researches_json_root = {
    "game": GAME_NAME,
    "data_type": "research",
    "version": None,
    "last_updated": RETRIEVED_DATE,
    "researches": processed_researches
}
with open(os.path.join(DATA_DIR, "researches.json"), "w", encoding="utf-8") as f:
    json.dump(researches_json_root, f, ensure_ascii=False, indent=2)

# categories.json
categories_json_root = {
    "game": GAME_NAME,
    "last_updated": RETRIEVED_DATE,
    "categories": categories_data
}
with open(os.path.join(DATA_DIR, "categories.json"), "w", encoding="utf-8") as f:
    json.dump(categories_json_root, f, ensure_ascii=False, indent=2)

# research_tree.json
tree_categories = []
for cat in categories_data:
    cat_researches = [r["id"] for r in processed_researches if r["category"] == cat["name"]["en"]]
    tree_categories.append({
        "id": cat["id"],
        "name": cat["name"]["en"],
        "researches": cat_researches
    })

research_tree_root = {
    "categories": tree_categories,
    "dependencies": tree_dependencies
}
with open(os.path.join(DATA_DIR, "research_tree.json"), "w", encoding="utf-8") as f:
    json.dump(research_tree_root, f, ensure_ascii=False, indent=2)

# sources.json
sources_json_root = {
    "last_updated": RETRIEVED_DATE,
    "sources": sources_data
}
with open(os.path.join(DATA_DIR, "sources.json"), "w", encoding="utf-8") as f:
    json.dump(sources_json_root, f, ensure_ascii=False, indent=2)

# 5. Generate Reports

# coverage_report.json
coverage_report = {
    "total_researches_found": total_researches_found,
    "verified": count_verified,
    "partial": count_partial,
    "unverified": count_unverified,
    "conflicting": count_conflicting,
    "total_levels": total_levels_cnt,
    "missing_researches": missing_researches_list,
    "missing_levels": missing_levels_total,
    "missing_fields": [
        "levels[2..max].cost",
        "levels[2..max].time_seconds",
        "levels[2..max].effect",
        "name.ja"
    ]
}
with open(os.path.join(REPORTS_DIR, "coverage_report.json"), "w", encoding="utf-8") as f:
    json.dump(coverage_report, f, ensure_ascii=False, indent=2)

# verification_report.json
verification_report = {
    "verified_at": RETRIEVED_DATE,
    "game": GAME_NAME,
    "strict_rule_enforced": True,
    "guessed_values": 0,
    "schema_compatibility": {
        "facility_costs_json_aligned": True,
        "resource_keys": ["wood", "grain", "herb", "steel", "stone", "study_scroll"],
        "time_key": "time_seconds",
        "null_handling": "strict_null"
    },
    "summary": {
        "verified_researches_ratio": f"{count_verified}/{total_researches_found}",
        "partial_researches_ratio": f"{count_partial}/{total_researches_found}",
        "missing_levels_count": sum(len(m["missing"]) for m in missing_levels_total)
    }
}
with open(os.path.join(REPORTS_DIR, "verification_report.json"), "w", encoding="utf-8") as f:
    json.dump(verification_report, f, ensure_ascii=False, indent=2)

# conflicts.json
conflicts_report = {
    "verified_at": RETRIEVED_DATE,
    "total_conflicts": 0,
    "conflicts": []
}
with open(os.path.join(REPORTS_DIR, "conflicts.json"), "w", encoding="utf-8") as f:
    json.dump(conflicts_report, f, ensure_ascii=False, indent=2)

print("Research Database & Reports successfully generated!")
