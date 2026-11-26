/* Переключатель языков: русский (оригинал), английский, армянский.
   Переводит весь текст страницы и подписи (подсказки на диване, alt, placeholder) на лету,
   в том числе то, что скрипты дописывают позже (каталог, пуф, форма). */
(function(){
const L = {en: 0, hy: 1};
// точные фразы: русский → [английский, армянский]
const D = {
"3D-просмотр":["3D view","3D դիտում"],
"Каталог":["Catalog","Կատալոգ"],
"Что внутри":["Inside","Ինչ կա ներսում"],
"Партнёрам":["Partners","Գործընկերներին"],
"фон":["bg","ֆոն"],
"Фабрика мягкой мебели · Самара":["Upholstered furniture factory · Samara","Փափուկ կահույքի ֆաբրիկա · Սամարա"],
"Диван, который можно":["A sofa you can","Բազմոց, որը կարելի է"],
"покрутить":["spin around","պտտել"],
"до покупки":["before you buy","մինչև գնելը"],
"Собираем угловые, прямые и модульные диваны, кресла и пуфы на своём производстве. Пружинный блок, ортопедические латы, ткань на выбор.":
 ["We make corner, straight and modular sofas, armchairs and poufs at our own factory. Pocket springs, orthopedic slats, fabric of your choice.","Մեր արտադրամասում պատրաստում ենք անկյունային, ուղիղ և մոդուլային բազմոցներ, բազկաթոռներ և պուֆեր։ Զսպանակային բլոկ, օրթոպեդիկ ձողիկներ, ընտրովի գործվածք։"],
"Открыть 3D-просмотр":["Open 3D view","Բացել 3D դիտումը"],
"Получить прайс-лист":["Get the price list","Ստանալ գնացուցակը"],
"модели в каталоге":["models in the catalog","մոդել կատալոգում"],
"длина углового":["corner sofa length","անկյունայինի երկարություն"],
"Пн–Пт":["Mon–Fri","Երկ–Ուրբ"],
"тяните, чтобы повернуть · наведите на точки":["drag to rotate · hover the dots","քաշեք՝ պտտելու համար · սեղմեք կետերին"],
"Покрутите, приблизьте, примерьте ткань":["Spin it, zoom in, try on a fabric","Պտտեք, մոտեցրեք, փորձեք գործվածքը"],
"Вращайте диван мышкой или пальцем, колёсиком приближайте швы. Справа выберите модель и цвет ткани. На телефоне кнопка «В вашей комнате» ставит диван у вас дома через камеру.":
 ["Rotate the sofa with your mouse or finger and zoom in on the seams with the wheel. Pick a model and fabric colour on the right. On a phone, the “In your room” button places the sofa in your home through the camera.","Պտտեք բազմոցը մկնիկով կամ մատով, անիվով մոտեցրեք կարերը։ Աջ կողմում ընտրեք մոդելը և գործվածքի գույնը։ Հեռախոսում «Ձեր սենյակում» կոճակը տեսախցիկով բազմոցը կդնի ձեր տանը։"],
"В вашей комнате":["In your room","Ձեր սենյակում"],
"Модель":["Model","Մոդել"],
"Предпросмотр":["Preview","Նախադիտում"],
"Ткань":["Fabric","Գործվածք"],
"Покрытие столешницы":["Tabletop finish","Սեղանի մակերես"],
"Каркас и ножки":["Frame and legs","Կմախք և ոտքեր"],
"По умолчанию":["Default","Ըստ նախնականի"],
"Цвет и рисунок в 3D могут немного отличаться от реальных":["Colours and patterns in 3D may differ slightly from the real thing","3D-ում գույնը և նախշը կարող են մի փոքր տարբերվել իրականից"],
"Разложить в 3D":["Extend in 3D","Բացել 3D-ում"],
"Рисунок и оттенок покрытия показаны примерно: на каждой плите камня рисунок свой. Образцы покрытий можно посмотреть на фабрике.":
 ["The pattern and shade are approximate: every stone slab has its own pattern. Finish samples can be seen at the factory.","Նախշը և երանգը մոտավոր են․ յուրաքանչյուր քարե սալ ունի իր նախշը։ Նմուշները կարելի է տեսնել ֆաբրիկայում։"],
"Как на фото":["As in the photo","Ինչպես լուսանկարում"],
"Цвет ткани показан примерно: оттенок на экране отличается от живого образца. Образцы тканей можно посмотреть на фабрике.":
 ["Fabric colours are approximate: the shade on screen differs from the real sample. You can see fabric samples at the factory.","Գործվածքի գույնը մոտավոր է․ էկրանի երանգը տարբերվում է իրական նմուշից։ Նմուշները կարող եք տեսնել ֆաբրիկայում։"],
"Узнать цену этой модели":["Ask the price of this model","Իմանալ այս մոդելի գինը"],
"Пуф 5 в 1":["5-in-1 pouf","Պուֆ 5-ը 1-ում"],
"Один куб. Пять табуреток.":["One cube. Five stools.","Մեկ խորանարդ։ Հինգ աթոռակ։"],
"Стенки пуфа — это сиденья четырёх табуреток, крышка — пятая. Нажмите «Разбери меня», а потом чуть поверните пуф: табуретки встанут в ряд.":
 ["The sides of the pouf are the seats of four stools, and the lid is the fifth. Press “Take me apart”, then turn the pouf a little and the stools will line up.","Պուֆի պատերը չորս աթոռակների նստատեղերն են, կափարիչը՝ հինգերորդը։ Սեղմեք «Ապամոնտաժիր ինձ», հետո մի փոքր պտտեք պուֆը՝ աթոռակները կշարվեն։"],
"Жёлтый + тёмно-синий":["Yellow + navy","Դեղին + մուգ կապույտ"],
"Металлокаркас":["Metal frame","Մետաղական կմախք"],
"крутите мышкой":["drag to rotate","պտտեք մկնիկով"],
"поверните пуф":["turn the pouf","պտտեք պուֆը"],
"мест":["seats","նստատեղ"],
"или кликните по пуфу дважды":["or double-click the pouf","կամ կրկնակի սեղմեք պուֆին"],
"Покрутите пуф — табуретки встанут в ряд":["Turn the pouf and the stools will line up","Պտտեք պուֆը՝ աթոռակները կշարվեն"],
"куб":["cube","խորանարդ"],
"сиденье":["seat","նստատեղ"],
"Разбери меня":["Take me apart","Ապամոնտաժիր ինձ"],
"Собери обратно":["Put it back","Հավաքիր նորից"],
"Секунду…":["One moment…","Մի պահ…"],
"Собираем пуф…":["Assembling the pouf…","Հավաքում ենք պուֆը…"],
"Модели фабрики":["Our models","Ֆաբրիկայի մոդելները"],
"Все":["All","Բոլորը"],
"Угловые":["Corner","Անկյունային"],
"Прямые":["Straight","Ուղիղ"],
"Аккордеоны":["Accordion","Ակորդեոն"],
"Кресла":["Armchairs","Բազկաթոռներ"],
"Пуфы":["Poufs","Պուֆեր"],
"Сколько сантиметров у вас вдоль стены?":["How many centimetres do you have along the wall?","Քանի՞ սանտիմետր ունեք պատի երկայնքով"],
"любая":["any","ցանկացած"],
"Покажем модели, которые поместятся у вашей стены.":["We’ll show the models that fit along your wall.","Ցույց կտանք այն մոդելները, որոնք կտեղավորվեն ձեր պատի մոտ։"],
"Смотреть в 3D":["View in 3D","Դիտել 3D-ով"],
"3D скоро":["3D soon","3D շուտով"],
"Диван в разрезе":["Sofa cross-section","Բազմոցը կտրվածքով"],
"Наведите на схему, и слои разойдутся. Так устроено сиденье в моделях «Премиум», «Уют», «Полина 2» и «София».":
 ["Hover the diagram and the layers will separate. This is how the seat is built in the Premium, Uyut, Polina 2 and Sofia models.","Սեղմեք սխեմային, և շերտերը կբաժանվեն։ Այսպես է կառուցված նստատեղը «Պրեմիում», «Ույուտ», «Պոլինա 2» և «Սոֆիա» մոդելներում։"],
"Мебельная ткань":["Upholstery fabric","Կահույքի գործվածք"],
"Ткань и цвет вы выбираете сами.":["You choose the fabric and colour.","Գործվածքը և գույնը ընտրում եք դուք։"],
"Высокоэластичный ППУ":["High-resilience foam","Բարձր առաձգականության փրփուր"],
"Держит форму и не продавливается со временем.":["Keeps its shape and doesn’t sag over time.","Պահում է ձևը և ժամանակի ընթացքում չի նստում։"],
"Независимый пружинный блок":["Pocket spring unit","Անկախ զսպանակային բլոկ"],
"Каждая пружина работает отдельно, поэтому сидеть и спать ровно.":["Each spring works on its own, so sitting and sleeping stay even.","Յուրաքանչյուր զսպանակ աշխատում է առանձին, ուստի նստելն ու քնելը հարթ է։"],
"Ортопедические латы":["Orthopedic slats","Օրթոպեդիկ ձողիկներ"],
"Вариант основы вместо пружинного блока в моделях «Уют», «Полина 2» и «София». Подушки спинки набиты ППУ-крошкой.":
 ["An alternative base instead of springs in the Uyut, Polina 2 and Sofia models. Back cushions are filled with shredded foam.","Զսպանակային բլոկի փոխարեն հիմքի տարբերակ «Ույուտ», «Պոլինա 2» և «Սոֆիա» մոդելներում։ Թիկնակի բարձերը լցված են փրփուրի փշրանքով։"],
"Партнёрам и покупателям":["For partners and buyers","Գործընկերներին և գնորդներին"],
"Работаем с магазинами, дизайнерами и частными покупателями":["We work with shops, designers and private buyers","Աշխատում ենք խանութների, դիզայներների և մասնավոր գնորդների հետ"],
"Доставка":["Delivery","Առաքում"],
"Постоянным клиентам отправляем заказы транспортными компаниями.":["We ship orders to regular customers via freight companies.","Մշտական հաճախորդներին պատվերներն ուղարկում ենք տրանսպորտային ընկերություններով։"],
"Сотрудничество":["Cooperation","Համագործակցություն"],
"Хорошие условия для партнёров и разные варианты оплаты заказов.":["Good terms for partners and several payment options.","Լավ պայմաններ գործընկերների համար և վճարման տարբեր տարբերակներ։"],
"Гарантия":["Warranty","Երաշխիք"],
"Следим за качеством и выполняем гарантийные обязательства на всю нашу мебель.":["We take care of quality and honour the warranty on all our furniture.","Հետևում ենք որակին և կատարում ենք երաշխիքային պարտավորությունները մեր ամբողջ կահույքի համար։"],
"Запросить прайс-лист":["Request the price list","Պահանջել գնացուցակը"],
"Пришлём актуальные цены и условия для вашего города.":["We’ll send current prices and terms for your city.","Կուղարկենք ձեր քաղաքի համար արդի գներն ու պայմանները։"],
"Как к вам обращаться":["Your name","Ինչպես դիմել ձեզ"],
"Телефон":["Phone","Հեռախոս"],
"Город":["City","Քաղաք"],
"Кто вы":["You are","Դուք"],
"Мебельный магазин":["A furniture shop","Կահույքի խանութ"],
"Дизайнер интерьеров":["An interior designer","Ինտերիերի դիզայներ"],
"Частный покупатель":["A private buyer","Մասնավոր գնորդ"],
"Получить прайс":["Get prices","Ստանալ գները"],
"Укажите имя и телефон, чтобы мы могли перезвонить.":["Enter your name and phone so we can call you back.","Նշեք անունը և հեռախոսը, որպեսզի զանգահարենք։"],
"Это демо-версия: заявка пока никуда не уходит. Позвоните: +7 (999) 172-75-79.":["This is a demo: the request isn’t sent anywhere yet. Call us: +7 (999) 172-75-79.","Սա դեմո տարբերակ է․ հայտը դեռ ոչ մի տեղ չի ուղարկվում։ Զանգահարեք՝ +7 (999) 172-75-79։"],
"Телефоны":["Phones","Հեռախոսներ"],
"Почта":["Email","Էլ. փոստ"],
"Фабрика":["Factory","Ֆաբրիկա"],
"г. Самара, Гаражный проезд, 3":["3 Garazhny proezd, Samara, Russia","Սամարա, Գարաժնի անցում, 3"],
"Время работы":["Opening hours","Աշխատանքային ժամեր"],
"Пн–Пт, 9:00–17:00":["Mon–Fri, 9:00–17:00","Երկ–Ուրբ, 9:00–17:00"],
"© 2026 Мебельная фабрика «Перспектива». Демо-версия нового сайта.":["© 2026 Perspektiva furniture factory. Demo of the new website.","© 2026 «Պերսպեկտիվա» կահույքի ֆաբրիկա։ Նոր կայքի դեմո տարբերակ։"],
"Перспектива, на главную":["Perspektiva, home","Պերսպեկտիվա, գլխավոր"],
"Мебельная фабрика Перспектива":["Perspektiva furniture factory","Պերսպեկտիվա կահույքի ֆաբրիկա"],
"Разделы":["Sections","Բաժիններ"],
"Цвет сайта":["Site colours","Կայքի գույները"],
"Фон сайта":["Site background","Կայքի ֆոնը"],
"Язык":["Language","Լեզու"],
"Лес":["Forest","Անտառ"],"Полночь":["Midnight","Կեսգիշեր"],"Роза":["Rose","Վարդ"],"Олива":["Olive","Ձիթապտուղ"],"Графит":["Graphite","Գրաֆիտ"],"Лёд":["Ice","Սառույց"],
"Стёжка":["Quilting","Կարվածք"],"Мягкий свет":["Soft light","Մեղմ լույս"],"Силуэты диванов":["Sofa outlines","Բազմոցների ուրվագծեր"],
"Деревянный подлокотник":["Wooden armrest","Փայտե բազկակալ"],
"Внутри: пружинный блок + ППУ":["Inside: pocket springs + foam","Ներսում՝ զսպանակային բլոկ + փրփուր"],
"Внутри сиденья: независимый пружинный блок и ППУ":["Inside the seat: pocket springs and foam","Նստատեղի ներսում՝ անկախ զսպանակներ և փրփուր"],
"Ткань на выбор: примерьте цвет в 3D-просмотре":["Fabric of your choice: try a colour in 3D view","Ընտրովի գործվածք․ փորձեք գույնը 3D դիտումում"],
"Ткань на выбор":["Fabric of your choice","Ընտրովի գործվածք"],
"Подушки спинки: ППУ-крошка":["Back cushions: shredded foam","Թիկնակի բարձեր՝ փրփուրի փշրանք"],
"Подушки спинки набиты ППУ-крошкой":["Back cushions are filled with shredded foam","Թիկնակի բարձերը լցված են փրփուրի փշրանքով"],
"3D-модель дивана":["3D sofa model","Բազմոցի 3D մոդել"],
"Молочный":["Milk","Կաթնագույն"],"Песок":["Sand","Ավազ"],"Глубокий синий":["Deep blue","Մուգ կապույտ"],"Пыльная роза":["Dusty rose","Փոշոտ վարդ"],"Кирпич":["Brick","Աղյուսագույն"],
"Пыльная роза + кирпич":["Dusty rose + brick","Փոշոտ վարդ + աղյուսագույն"],"Олива + песок":["Olive + sand","Ձիթապտուղ + ավազ"],"Глубокий синий + молочный":["Deep blue + milk","Մուգ կապույտ + կաթնագույն"],"Графит + серый":["Graphite + grey","Գրաֆիտ + մոխրագույն"],
"Тёмный каркас":["Dark frame","Մուգ կմախք"],"Тёмный":["Dark","Մուգ"],"Светлый каркас":["Light frame","Բաց կմախք"],"Светлый":["Light","Բաց"],
"Тип мебели":["Furniture type","Կահույքի տեսակ"],
"Имя":["Name","Անուն"],"Самара":["Samara","Սամարա"],
"Диваны":["Sofas","Բազմոցներ"],"Кресла и пуфы":["Armchairs and poufs","Բազկաթոռներ և պուֆեր"],"Столы":["Tables","Սեղաններ"],
"Обеденные столы":["Dining tables","Ճաշի սեղաններ"],"Все столы раздвигаются":["Every table extends","Բոլոր սեղանները բացվում են"],
"В будни стол компактный, а когда приходят гости — раздвигается на 40–60 см. Наведите на стол, чтобы его раздвинуть.":
 ["Compact on weekdays, and when guests arrive it extends by 40–60 cm. Hover a table to extend it.","Աշխատանքային օրերին սեղանը կոմպակտ է, իսկ հյուրերի գալու ժամանակ բացվում է 40–60 սմ-ով։ Սեղմեք սեղանին՝ այն բացելու համար։"],
"Раздвинуть все":["Extend all","Բացել բոլորը"],"Сложить все":["Fold all","Ծալել բոլորը"],
"Сколько гостей ждёте?":["How many guests are coming?","Քանի՞ հյուր եք սպասում"],"Число гостей":["Number of guests","Հյուրերի քանակ"],
"ТОКИО":["TOKYO","ՏՈԿԻՈ"],"АМСТЕРДАМ":["AMSTERDAM","ԱՄՍՏԵՐԴԱՄ"],"ВЕГА":["VEGA","ՎԵԳԱ"],"ФАНТОМ":["PHANTOM","ՖԱՆՏՈՄ"],"АМЕРИКАНО":["AMERICANO","ԱՄԵՐԻԿԱՆՈ"],"ВАЛЕРИО":["VALERIO","ՎԱԼԵՐԻՈ"],
"ГРЕНФИЛД":["GREENFIELD","ԳՐԻՆՖԻԼԴ"],"ДИАМАНТ":["DIAMANT","ԴԻԱՄԱՆՏ"],"КРУНК":["KRUNK","ԿՐՈՒՆԿ"],"СУНК":["SUNK","ՍՈՒՆԿ"],"МОРОКО":["MOROCCO","ՄԱՐՈԿՈ"],"ОРЕО":["OREO","ՕՐԵՈ"],
"Пн–Пт ":["Mon–Fri ","Երկ–Ուրբ "],
"3D-просмотр · диваны":["3D view · sofas","3D դիտում · բազմոցներ"],
"3D-просмотр · обеденные столы":["3D view · dining tables","3D դիտում · ճաշի սեղաններ"],
"3D-просмотр · кресла":["3D view · armchairs","3D դիտում · բազկաթոռներ"],
"Вращайте диван мышкой или пальцем, колёсиком приближайте швы. Справа выберите модель, под окном — цвет ткани. На телефоне кнопка «В вашей комнате» ставит диван у вас дома через камеру.":
 ["Rotate the sofa with your mouse or finger and zoom in on the seams with the wheel. Pick a model on the right and a fabric colour under the view. On a phone, the “In your room” button places the sofa in your home through the camera.","Պտտեք բազմոցը մկնիկով կամ մատով, անիվով մոտեցրեք կարերը։ Աջ կողմում ընտրեք մոդելը, իսկ ներքևում՝ գործվածքի գույնը։ Հեռախոսում «Ձեր սենյակում» կոճակը տեսախցիկով բազմոցը կդնի ձեր տանը։"],
"Разложить":["Unfold","Բացել"],"Собрать":["Fold","Հավաքել"],
"Разложите стол и примерьте покрытие":["Extend the table and try on a finish","Բացեք սեղանը և փորձեք մակերեսը"],
"Все 12 столов фабрики в 3D. Кнопка «Разложить» показывает, как работает механизм, а справа можно сменить покрытие столешницы и цвет ножек.":
 ["All 12 of the factory’s tables in 3D. The “Unfold” button shows how the mechanism works, and on the right you can change the tabletop finish and the colour of the legs.","Ֆաբրիկայի բոլոր 12 սեղանները 3D-ում։ «Բացել» կոճակը ցույց է տալիս, թե ինչպես է աշխատում մեխանիզմը, իսկ աջ կողմում կարելի է փոխել սեղանի մակերեսը և ոտքերի գույնը։"],
"3D-модель обеденного стола":["3D model of a dining table","Ճաշի սեղանի 3D մոդել"],
"3D-модель кресла":["3D armchair model","Բազկաթոռի 3D մոդել"],
"3D-модель скоро":["3D model coming soon","3D մոդելը շուտով"],
"Узнать цену этого стола":["Ask the price of this table","Իմանալ այս սեղանի գինը"],
"Ткань пуфа":["Pouf fabric","Պուֆի գործվածք"],
"Тип дивана":["Sofa type","Բազմոցի տեսակ"],
"Раздел каталога":["Catalog section","Կատալոգի բաժին"],
"Кресла под пару к диванам":["Armchairs to match the sofas","Բազկաթոռներ՝ բազմոցներին համապատասխան"],
"С деревянным подлокотником и мягкие, кресло-книжка со спальным местом, две качалки и пуф «5 в 1». Ткань — любая из коллекции фабрики.":
 ["With wooden armrests and fully upholstered, a fold-out armchair with a sleeping place, two rocking chairs and the “5 in 1” pouf. Any fabric from the factory collection.","Փայտե բազկակալներով և փափուկ, բացվող բազկաթոռ՝ քնելու տեղով, երկու ճոճաթոռ և «5-ը 1-ում» պուֆ։ Գործվածքը՝ ֆաբրիկայի հավաքածուից ցանկացածը։"],
"Кресла фабрики":["The factory’s armchairs","Ֆաբրիկայի բազկաթոռները"],
"Кресла под пару к диванам: с деревянным подлокотником, мягкие, кресло-книжка и качалки. Покрутите кресло в 3D; у кресел без модели пока фото.":
 ["Armchairs to match the sofas: with wooden armrests, fully upholstered, a fold-out armchair and rocking chairs. Spin an armchair in 3D; chairs without a model show a photo for now.","Բազկաթոռներ՝ բազմոցներին համապատասխան․ փայտե բազկակալներով, փափուկ, բացվող բազկաթոռ և ճոճաթոռներ։ Պտտեք բազկաթոռը 3D-ում․ առանց մոդելի բազկաթոռների համար առայժմ լուսանկար է։"],
"фото":["photo","լուսանկար"],
"Белый мрамор":["White marble","Սպիտակ մարմար"],"Чёрный мрамор":["Black marble","Սև մարմար"],"Калакатта":["Calacatta","Կալակատա"],
"Бетон":["Concrete","Բետոն"],"Бежевый мрамор":["Beige marble","Բեժ մարմար"],"Оникс":["Onyx","Օնիքս"],"Оникс синий":["Blue onyx","Կապույտ օնիքս"],
"Песчаник":["Sandstone","Ավազաքար"],"Белый":["White","Սպիտակ"],"Чёрный":["Black","Սև"],"Серый":["Grey","Մոխրագույն"],
"Светло-серый":["Light grey","Բաց մոխրագույն"],"Бежевый":["Beige","Բեժ"],
"Кресла и пуф":["Armchairs and pouf","Բազկաթոռներ և պուֆ"],
"Русский":["Russian","Ռուսերեն"]
};
// куски названий и размеров: заменяются внутри строки (длинные раньше коротких)
const P = [
["с деревянным подлокотником","with wooden armrests","փայտե բազկակալներով"],
["с мягкими подлокотниками","with soft armrests","փափուկ բազկակալներով"],
["с мягким подлокотником","with soft armrests","փափուկ բազկակալներով"],
["с оттоманкой","with ottoman","օսմանյակով"],
["мягкий бок","soft sides","փափուկ կողքեր"],
["без боковин","without arms","առանց կողապատերի"],
["кресло-книжка","fold-out armchair","բացվող բազկաթոռ"],
["кресло-качалка","rocking chair","ճոճաթոռ"],
["п-образный","U-shaped","U-աձև"],["г-образный","L-shaped","L-աձև"],
["угловой","corner","անկյունային"],["прямой","straight","ուղիղ"],["кресло","armchair","բազկաթոռ"],["модель","model","մոդել"],
["спальное место","sleeping area","քնելու տեղ"],["спальное","sleeping area","քնելու տեղ"],["габарит","size","չափսեր"],
["посадка","seat height","նստատեղ"],["высота","height","բարձրություն"],["вес","weight","քաշ"],
["3D-модель","3D model","3D մոդել"],["Диван","Sofa","Բազմոց"],
["аккордеон","Akkordeon","Ակորդեոն"],["фаворит","Favorit","Ֆավորիտ"],["капля","Kaplya","Կապլյա"],["лофт","Loft","Լոֆթ"],
["уют","Uyut","Ույուտ"],["премиум","Premium","Պրեմիում"],["полина","Polina","Պոլինա"],["софия","Sofia","Սոֆիա"],["комфорт","Komfort","Կոմֆորտ"],
["лилия","Liliya","Լիլիա"],["виктория","Viktoria","Վիկտորիա"],["глайдер","Glider","Գլայդեր"],["качалка","Rocker","Ճոճաթոռ"],["пуф","Pouf","Պուֆ"],
["5 в 1","5 in 1","5-ը 1-ում"],
["колонна из мдф","MDF pedestal","ՄԴՖ սյուն"],["колонна из металла","metal pedestal","մետաղական սյուն"],["металлические ноги","metal legs","մետաղական ոտքեր"],
["металлическая опора","metal base","մետաղական հենարան"],["автолифт","auto-lift","ավտոլիֆտ"],["выкатной механизм","pull-out mechanism","դուրս եկող մեխանիզմ"],
["шариковые направляющие","ball-bearing runners","գնդիկավոր ուղղորդիչներ"],["премиум-пластик lemark","Lemark premium plastic","Lemark պրեմիում պլաստիկ"],
["стекло сатин","satin glass","սատին ապակի"],["гранит (керамика)","granite (ceramic)","գրանիտ (կերամիկա)"],["керамопласт","ceramoplast","կերամոպլաստ"],
["керамика","ceramic","կերամիկա"],["пластик","plastic","պլաստիկ"],["стол","table","սեղան"],["тумба","pedestal","սյուն"],["до ","up to ","մինչև "],[" на "," × "," × "],["от ","from ","սկսած "],[" и "," and "," և "]
];
P.sort((a,b) => b[0].length - a[0].length);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PR = P.map(p => [new RegExp(esc(p[0]), "gi"), p]);
// правила с числами
const R = [
[/^до (\d+) гостей$/, (m,a)=>[`up to ${a} guests`, `մինչև ${a} հյուր`]],
[/^Стол (\S+)$/i, (m,a)=>{ const d = D[a.toUpperCase()]; const t = d ? d.map(x=>x.charAt(0)+x.slice(1).toLowerCase()) : [a,a]; return /^[А-ЯЁ]+$/.test(a) ? [`Table ${d?d[0]:a}`, `Սեղան ${d?d[1]:a}`] : [`Table ${t[0]}`, `Սեղան ${t[1]}`]; }],
[/^[Рр]аскладка (.+)$/, (m,a)=>[`unfolds to ${a}`, `բացված՝ ${a}`]],
[/^Подойдут: (\d+) из (\d+)$/, (m,a,b)=>[`Suitable: ${a} of ${b}`, `Կհամապատասխանեն՝ ${a}-ը ${b}-ից`]],
[/^Все (\d+) столов$/, (m,a)=>[`All ${a} tables`, `Բոլոր ${a} սեղանները`]],
[/^→ раздвинуть \+(\d+) →$/, (m,a)=>[`→ extends +${a} →`, `→ բացվում է +${a} →`]],
[/^ещё размеры: (.*) см$/, (m,a)=>[`more sizes: ${a} cm`, `այլ չափսեր՝ ${a} սմ`]],
[/^Поместятся: (\d+) из (\d+)\. Оставьте 10–15 см запаса на плинтус и розетки\.$/, (m,a,b)=>[`Fits: ${a} of ${b}. Leave 10–15 cm for skirting boards and sockets.`, `Տեղավորվում է՝ ${a}-ը ${b}-ից։ Թողեք 10–15 սմ պաշար շրիշակի և վարդակների համար։`]],
];
function units(s, i){ return s.replace(/(\d)\s?см(?![А-Яа-яЁё])/g, i ? "$1 սմ" : "$1 cm").replace(/(\d)\s?кг(?![А-Яа-яЁё])/g, i ? "$1 կգ" : "$1 kg").replace(/(\d)\s?м(?![А-Яа-яЁё])/g, i ? "$1 մ" : "$1 m"); }
function tr(str, lang){
  if(lang === "ru" || !/[А-Яа-яЁё]/.test(str)) return str;
  const i = L[lang], lead = str.match(/^\s*/)[0], tail = str.match(/\s*$/)[0], core = str.trim().replace(/ /g, " ");
  if(D[core]) return lead + D[core][i] + tail;
  const up = D[core.toUpperCase()];   // «Токио» — то же, что «ТОКИО», но с маленькими буквами
  if(up && core !== core.toUpperCase()) return lead + up[i].charAt(0) + up[i].slice(1).toLowerCase() + tail;
  if(core.includes(" · ")) return lead + core.split(" · ").map(x => tr(x, lang)).join(" · ") + tail;
  for(const [rx, fn] of R){ const m = core.match(rx); if(m) return lead + fn(...m)[i] + tail; }
  let out = units(core, i);
  for(const [rx, p] of PR) out = out.replace(rx, (w) => { const t = p[1 + i]; return w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase() ? t.charAt(0).toUpperCase() + t.slice(1) : t; });
  if(/^[a-zA-Z0-9]/.test(out) || i) out = out.charAt(0).toUpperCase() + out.slice(1);
  return lead + out + tail;
}
let LANG = "ru";
const textMap = new WeakMap(), attrMap = new WeakMap(), ATTRS = ["data-label","aria-label","title","placeholder","alt"];
function skip(el){ return !el || el.closest("script,style,#intro,.lang"); }
function doText(n){
  if(skip(n.parentElement)) return;
  let rec = textMap.get(n);
  if(!rec || n.nodeValue !== rec.out){ rec = {ru: n.nodeValue}; }
  rec.out = tr(rec.ru, LANG); textMap.set(n, rec);
  if(n.nodeValue !== rec.out) n.nodeValue = rec.out;
}
function doAttrs(el){
  if(skip(el)) return;
  let recs = attrMap.get(el); if(!recs){ recs = {}; attrMap.set(el, recs); }
  for(const a of ATTRS){
    const v = el.getAttribute(a); if(v === null) continue;
    let rec = recs[a]; if(!rec || v !== rec.out) rec = recs[a] = {ru: v};
    rec.out = tr(rec.ru, LANG); if(v !== rec.out) el.setAttribute(a, rec.out);
  }
}
function walk(root){
  if(root.nodeType === 3){ doText(root); return; }
  if(root.nodeType !== 1) return;
  doAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n; while(n = w.nextNode()) n.nodeType === 3 ? doText(n) : doAttrs(n);
}
let busy = false;
const mo = new MutationObserver(ms => { if(busy) return; busy = true;
  for(const m of ms){
    if(m.type === "characterData") doText(m.target);
    else if(m.type === "attributes") doAttrs(m.target);
    else m.addedNodes.forEach(walk);
  }
  busy = false; });
mo.observe(document.body, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS});

/* логотип и заставка на выбранном языке */
const LOGO = {ru: ["МЕБЕЛЬНАЯ ФАБРИКА","ПЕРСПЕ","КТИВА"], en: ["FURNITURE FACTORY","PERSPE","KTIVA"], hy: ["ԿԱՀՈՒՅՔԻ ՖԱԲՐԻԿԱ","ՊԵՐՍՊԵ","ԿՏԻՎԱ"]};
function setLogo(lang){
  const [small, l, r] = LOGO[lang];
  document.querySelectorAll("[data-logo-small]").forEach(e => e.textContent = small);
  document.querySelectorAll("[data-logo-big]").forEach(e => e.textContent = l + r);
  // заставка: буквы верхней строки выпрыгивают по одной, нижняя строка съезжается из двух половин
  const is = document.querySelector("#intro .i-small");
  if(is) is.innerHTML = [...small].map((ch, k) => `<span style="--i:${k}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
  const il = document.querySelector("#intro .i-big .l"), ir = document.querySelector("#intro .i-big .r");
  if(il){ il.textContent = l; ir.textContent = r; }
  const sk = document.querySelector("#intro .i-skip"); if(sk) sk.textContent = {ru:"пропустить", en:"skip", hy:"բաց թողնել"}[lang];
  document.title = {ru:"Перспектива — мебельная фабрика", en:"Perspektiva — furniture factory", hy:"Պերսպեկտիվա — կահույքի ֆաբրիկա"}[lang];
  document.querySelector(".logo-img")?.toggleAttribute("hidden", lang !== "ru");
  document.querySelector(".logo-svg")?.toggleAttribute("hidden", lang === "ru");
}
window.setLang = function(lang){
  if(!LOGO[lang]) lang = "ru"; LANG = lang;
  document.documentElement.lang = lang;
  busy = true; walk(document.body); busy = false; setLogo(lang);
  document.querySelectorAll(".lang button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  try{ localStorage.setItem("lang", lang); }catch(e){}
};
document.querySelector(".lang")?.addEventListener("click", e => { const b = e.target.closest("button"); if(b) setLang(b.dataset.lang); });
let start = new URLSearchParams(location.search).get("lang");
if(!start){ try{ start = localStorage.getItem("lang"); }catch(e){} }
setLang(start || "ru");
})();
