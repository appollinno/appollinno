# Image Sourcing & Attribution

All product, origin, brewing, and journal photography on this site is
sourced from [Wikimedia Commons](https://commons.wikimedia.org), under
Creative Commons licenses (CC BY, CC BY-SA) or CC0/public domain. No AI-
generated or placeholder imagery is used anywhere in the catalog or content.

## Why Wikimedia Commons, not Unsplash

The brief asked for "legitimate image sources and stable image URLs," with
Unsplash suggested as one option. In this environment, Unsplash's
unauthenticated hotlinking endpoint is retired and the main site returns
bot-challenge responses to automated fetches; getting real photos would
have required an Unsplash API key, which wasn't available. Wikimedia
Commons' public, keyless search API filled the same need — real,
properly licensed photography — without blocking on a credential.

## How the images were found and downloaded

1. `commons.wikimedia.org/w/api.php` (`action=query&list=search`) searched
   for each visual category the site needed (roasting, latte art, pour-over,
   French press, barista, coffee cherries/plant, packaging, cafés, etc.).
2. Results were hand-curated to drop irrelevant matches (old book scans,
   unrelated subjects that happened to match the search terms).
3. `action=query&prop=imageinfo` resolved each curated title to its real
   file URL, dimensions, license, and photographer credit.
4. Files were downloaded once and committed to `public/images/commons/`
   (self-hosted, not hotlinked) — both so the site has zero runtime
   dependency on Wikimedia's availability, and because Wikimedia's
   infrastructure rate-limits high-volume automated downloads; a
   production site should not hotlink its catalog images from there.

The scripts used are not committed (they were one-off tooling, not part of
the app), but the approach above is fully reproducible from the Commons API
docs if more images are needed later.

## Required attribution

CC BY and CC BY-SA require crediting the author. The full list below is
the attribution record for every image currently in `public/images/commons/`.
`lib/data/images.ts` is generated from the same manifest and carries this
same metadata (`license`, `artist`, `source`) on every entry, so a credits
page can be built from it (`allCreditedImages()`) without hand-maintaining
a second list.

| File | Title | Photographer | License | Source |
|---|---|---|---|---|

| `/images/commons/2-bridge-street-jedburgh-inside-new-naked-sourdough-caf.jpg` | 2 Bridge Street, Jedburgh inside new Naked Sourdough Café.jpg | Victuallers | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:2_Bridge_Street,_Jedburgh_inside_new_Naked_Sourdough_Café.jpg) |
| `/images/commons/arabica-coffee-plant-in-palm-house-at-kew-gardens.jpg` | Arabica coffee plant in Palm House at Kew Gardens.jpg | Daniel Case | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Arabica_coffee_plant_in_Palm_House_at_Kew_Gardens.jpg) |
| `/images/commons/baratza-encore-burr-coffee-grinder-and-coffee-beans.jpg` | Baratza Encore burr coffee grinder and coffee beans.jpg | massage-techniques | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Baratza_Encore_burr_coffee_grinder_and_coffee_beans.jpg) |
| `/images/commons/barista-frothing-milk-for-cappuccino-at-tabak-shop-in-esino-.jpg` | Barista frothing milk for cappuccino at Tabak shop in Esino Lario.jpg | Daniel Case | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Barista_frothing_milk_for_cappuccino_at_Tabak_shop_in_Esino_Lario.jpg) |
| `/images/commons/barista-portland.jpg` | Barista Portland.jpg | Bobzemuda | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Barista_Portland.jpg) |
| `/images/commons/barista-prepares-coffee-in-modern-caf-with-steam-rising-duri.jpg` | Barista prepares coffee in modern café with steam rising during busy morning hours.jpg | Shixart1985 | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Barista_prepares_coffee_in_modern_café_with_steam_rising_during_busy_morning_hours.jpg) |
| `/images/commons/barista-prepares-espresso-at-coffee-shop.jpg` | Barista prepares espresso at coffee shop.jpg | Shixart1985 | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Barista_prepares_espresso_at_coffee_shop.jpg) |
| `/images/commons/barista-preparing-espresso-in-a-cozy-coffee-shop-during-afte.jpg` | Barista preparing espresso in a cozy coffee shop during afternoon rush hour with warm lighting and relaxed ambiance.jpg | Shixart1985 | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Barista_preparing_espresso_in_a_cozy_coffee_shop_during_afternoon_rush_hour_with_warm_lighting_and_relaxed_ambiance.jpg) |
| `/images/commons/berne-botanic-garden-coffea-arabica.jpg` | Berne Botanic garden Coffea arabica.jpg | Feloidea | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Berne_Botanic_garden_Coffea_arabica.jpg) |
| `/images/commons/caf-coado.jpg` | Café coado.jpg | Melsj | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Café_coado.jpg) |
| `/images/commons/cafe-bustelo-espresso-ground-coffee-15837063936.jpg` | Cafe Bustelo Espresso Ground Coffee (15837063936).jpg | Willis Lam | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Cafe_Bustelo_Espresso_Ground_Coffee_(15837063936).jpg) |
| `/images/commons/coffea-arabica-36zz.jpg` | Coffea arabica 36zz.jpg | Photo by David J. Stang | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Coffea_arabica_36zz.jpg) |
| `/images/commons/coffea-arabica-41zz.jpg` | Coffea arabica 41zz.jpg | Photo by David J. Stang | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Coffea_arabica_41zz.jpg) |
| `/images/commons/coffea-arabica-42zz.jpg` | Coffea arabica 42zz.jpg | Photo by David J. Stang | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Coffea_arabica_42zz.jpg) |
| `/images/commons/coffee-beans-photographed-in-macro.jpg` | Coffee Beans Photographed in Macro.jpg | Photographer Robert Knapp www.modernartphotograph.com | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Coffee_Beans_Photographed_in_Macro.jpg) |
| `/images/commons/coffee-beans-seeds-23404782504.jpg` | Coffee Beans(seeds) - 23404782504.jpg | Pasi Mammela | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Coffee_Beans(seeds)_-_23404782504.jpg) |
| `/images/commons/coffee-beans2.jpg` | Coffee beans2.jpg | Popo le Chien | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Coffee_beans2.jpg) |
| `/images/commons/coffee-pour-over-setup.jpg` | Coffee Pour Over Setup.jpg | Cerebral726 | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Coffee_Pour_Over_Setup.jpg) |
| `/images/commons/cup-of-coffee-with-latte-art-2016.jpg` | Cup of coffee with latte art 2016.jpg | Abdulrohmatt | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Cup_of_coffee_with_latte_art_2016.jpg) |
| `/images/commons/dfc-6090-colorful-neighborhood-caf-in-khao-chi-chan-baristas.jpg` | DFC 6090 Colorful neighborhood café in Khao Chi Chan - baristas at work behind the counter amid baked goods jars of treats and a cheerful rainbow-painted interior.jpg | PattayaPatrol | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:DFC_6090_Colorful_neighborhood_café_in_Khao_Chi_Chan_-_baristas_at_work_behind_the_counter_amid_baked_goods_jars_of_treats_and_a_cheerful_rainbow-painted_interior.jpg) |
| `/images/commons/doutor-coffee-shop-53208125399.jpg` | Doutor Coffee Shop. (53208125399).jpg | MIKI Yoshihito | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Doutor_Coffee_Shop._(53208125399).jpg) |
| `/images/commons/drip-coffee-bangkok.jpg` | Drip Coffee Bangkok.jpg | Takeaway | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Drip_Coffee_Bangkok.jpg) |
| `/images/commons/drip-filter-coffee-after-pouring-water.jpg` | Drip filter coffee after pouring water.jpg | Suginami | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Drip_filter_coffee_after_pouring_water.jpg) |
| `/images/commons/drip-filter-coffee-before-pouring-water.jpg` | Drip filter coffee Before pouring water.jpg | Suginami | CC0 | [Commons](https://commons.wikimedia.org/wiki/File:Drip_filter_coffee_Before_pouring_water.jpg) |
| `/images/commons/french-press-coffee-making-05.jpg` | French Press coffee making 05.jpg | Infrogmation | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:French_Press_coffee_making_05.jpg) |
| `/images/commons/french-press-coffee-making-08.jpg` | French Press coffee making 08.jpg | Infrogmation | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:French_Press_coffee_making_08.jpg) |
| `/images/commons/french-press-coffee-making-11.jpg` | French Press coffee making 11.jpg | Infrogmation | CC BY-SA 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:French_Press_coffee_making_11.jpg) |
| `/images/commons/hamilton-beach-home-coffee-maker.jpg` | Hamilton Beach home coffee maker.jpg | Infrogmation of New Orleans | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Hamilton_Beach_home_coffee_maker.jpg) |
| `/images/commons/hearts-in-latte-art-krak-w-poland-2023.jpg` | Hearts in latte art, Kraków, Poland, 2023.jpg | Kgbo | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Hearts_in_latte_art,_Kraków,_Poland,_2023.jpg) |
| `/images/commons/last-stand-coffee-roaster-eugene-oregon.jpg` | Last Stand Coffee Roaster (Eugene, Oregon).jpg | Visitor7 | CC BY-SA 3.0 | [Commons](https://commons.wikimedia.org/wiki/File:Last_Stand_Coffee_Roaster_(Eugene,_Oregon).jpg) |
| `/images/commons/latte-art-london-grind-london-uk.jpg` | Latte art - London Grind, London, UK.jpg | Bex Walton | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Latte_art_-_London_Grind,_London,_UK.jpg) |
| `/images/commons/latte-art.jpg` | Latte Art.jpg | Lirazelf | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Latte_Art.jpg) |
| `/images/commons/lca-of-electric-drip-coffee-maker-vs-press-pot-5622181773.jpg` | LCA of Electric Drip Coffee Maker vs. Press Pot (5622181773).jpg | University of Michigan School for Environment and Sustainability from Ann Arbor | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:LCA_of_Electric_Drip_Coffee_Maker_vs._Press_Pot_(5622181773).jpg) |
| `/images/commons/macro-close-up-look-of-roasted-coffee-beans.jpg` | Macro close up look of roasted coffee beans.jpg | Jameswasswa | CC BY-SA 4.0 | [Commons](https://commons.wikimedia.org/wiki/File:Macro_close_up_look_of_roasted_coffee_beans.jpg) |
| `/images/commons/single-drip-coffee-filter.jpg` | Single drip coffee filter.jpg | watashiwani from Brooklyn, NY | CC BY 2.0 | [Commons](https://commons.wikimedia.org/wiki/File:Single_drip_coffee_filter.jpg) |
| `/images/commons/starr-090519-7985-coffea-arabica-fruit-and-leaves-kula-maui-.jpg` | Starr-090519-7985-Coffea arabica-fruit and leaves-Kula-Maui (24862236381).jpg | Forest and Kim Starr | CC BY 3.0 us | [Commons](https://commons.wikimedia.org/wiki/File:Starr-090519-7985-Coffea_arabica-fruit_and_leaves-Kula-Maui_(24862236381).jpg) |
| `/images/commons/starr-090618-1070-coffea-arabica-leaves-hana-hwy-maui-245979.jpg` | Starr-090618-1070-Coffea arabica-leaves-Hana Hwy-Maui (24597910769).jpg | Forest and Kim Starr | CC BY 3.0 us | [Commons](https://commons.wikimedia.org/wiki/File:Starr-090618-1070-Coffea_arabica-leaves-Hana_Hwy-Maui_(24597910769).jpg) |
| `/images/commons/starr-110209-0804-coffea-arabica-berries-and-leaves-resort-m.jpg` | Starr-110209-0804-Coffea arabica-berries and leaves-Resort Management Group Nursery Kihei-Maui (24981379541).jpg | Forest and Kim Starr | CC BY 3.0 us | [Commons](https://commons.wikimedia.org/wiki/File:Starr-110209-0804-Coffea_arabica-berries_and_leaves-Resort_Management_Group_Nursery_Kihei-Maui_(24981379541).jpg) |

**38 unique images**, reused across 38 content slots (several products/articles share an image where a dedicated photo for that exact context wasn't available — always a real, on-topic coffee photo, never a mismatched or placeholder one).
