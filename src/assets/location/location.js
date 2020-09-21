/*
 * @Description: 
 * @Version: 1.0
 * @Author: diaoqi
 * @Date: 2020-04-26 17:22:24
 * @LastEditTime: 2020-07-28 11:28:31
 */
const locationList = [{"code":"ANC","name":"Anchorage","cname":"安克雷奇","id":3376,"state":{"code":"AK","name":"Alaska","cname":"阿拉斯加","id":209}},{"code":"FAI","name":"Fairbanks","cname":"费尔班克斯","id":3377,"state":{"code":"AK","name":"Alaska","cname":"阿拉斯加","id":209}},{"code":"JNU","name":"Juneau","cname":"朱诺","id":3378,"state":{"code":"AK","name":"Alaska","cname":"阿拉斯加","id":209}},{"code":"BHM","name":"Birmingham","cname":"伯明罕","id":3379,"state":{"code":"AL","name":"Alabama","cname":"阿拉巴马","id":210}},{"code":"MGM","name":"Montgomery","cname":"蒙哥马利","id":3380,"state":{"code":"AL","name":"Alabama","cname":"阿拉巴马","id":210}},{"code":"MOB","name":"Mobile","cname":"莫比尔","id":3381,"state":{"code":"AL","name":"Alabama","cname":"阿拉巴马","id":210}},{"code":"FSM","name":"Fort Smith","cname":"史密斯堡","id":3382,"state":{"code":"AR","name":"Arkansas","cname":"阿肯色","id":211}},{"code":"FYV","name":"Fayetteville","cname":"费耶特维尔","id":3383,"state":{"code":"AR","name":"Arkansas","cname":"阿肯色","id":211}},{"code":"LIT","name":"Little Rock","cname":"小石城","id":3384,"state":{"code":"AR","name":"Arkansas","cname":"阿肯色","id":211}},{"code":"GDA","name":"Glendale","cname":"格兰代尔","id":3385,"state":{"code":"AZ","name":"Arizona","cname":"亚利桑那","id":212}},{"code":"MQA","name":"Mesa","cname":"梅萨","id":3386,"state":{"code":"AZ","name":"Arizona","cname":"亚利桑那","id":212}},{"code":"PHX","name":"Phoenix","cname":"凤凰城","id":3387,"state":{"code":"AZ","name":"Arizona","cname":"亚利桑那","id":212}},{"code":"STZ","name":"Scottsdale","cname":"史卡兹代尔","id":3388,"state":{"code":"AZ","name":"Arizona","cname":"亚利桑那","id":212}},{"code":"TPE","name":"Tempe","cname":"坦普","id":3389,"state":{"code":"AZ","name":"Arizona","cname":"亚利桑那","id":212}},{"code":"TUC","name":"Tucson","cname":"图森","id":3390,"state":{"code":"AZ","name":"Arizona","cname":"亚利桑那","id":212}},{"code":"YUM","name":"Yuma","cname":"优玛","id":3391,"state":{"code":"AZ","name":"Arizona","cname":"亚利桑那","id":212}},{"code":"LAX","name":"Los Angeles","cname":"洛杉矶","id":3392,"state":{"code":"CA","name":"California","cname":"加利福尼亚","id":213}},{"code":"SAN","name":"San Diego","cname":"圣迭戈","id":3393,"state":{"code":"CA","name":"California","cname":"加利福尼亚","id":213}},{"code":"SFO","name":"San Francisco","cname":"旧金山","id":3394,"state":{"code":"CA","name":"California","cname":"加利福尼亚","id":213}},{"code":"SJC","name":"San Jose","cname":"圣何塞","id":3395,"state":{"code":"CA","name":"California","cname":"加利福尼亚","id":213}},{"code":"ASE","name":"Aspen","cname":"阿斯彭","id":3396,"state":{"code":"CO","name":"Colorado","cname":"科罗拉多","id":214}},{"code":"AUX","name":"Aurora","cname":"奥罗拉","id":3397,"state":{"code":"CO","name":"Colorado","cname":"科罗拉多","id":214}},{"code":"COS","name":"Colorado Springs","cname":"科罗拉多斯普林斯","id":3398,"state":{"code":"CO","name":"Colorado","cname":"科罗拉多","id":214}},{"code":"DEN","name":"Denver","cname":"丹佛","id":3399,"state":{"code":"CO","name":"Colorado","cname":"科罗拉多","id":214}},{"code":"FNL","name":"Fort Collins","cname":"柯林斯堡","id":3400,"state":{"code":"CO","name":"Colorado","cname":"科罗拉多","id":214}},{"code":"GJT","name":"Grand Junction","cname":"大章克申","id":3401,"state":{"code":"CO","name":"Colorado","cname":"科罗拉多","id":214}},{"code":"VAC","name":"Vail","cname":"韦尔","id":3402,"state":{"code":"CO","name":"Colorado","cname":"科罗拉多","id":214}},{"code":"WBU","name":"Boulder","cname":"博尔德","id":3403,"state":{"code":"CO","name":"Colorado","cname":"科罗拉多","id":214}},{"code":"BDR","name":"Bridgeport","cname":"布里奇波特","id":3404,"state":{"code":"CT","name":"Connecticut","cname":"康涅狄格","id":215}},{"code":"DAQ","name":"Darien","cname":"达里恩","id":3405,"state":{"code":"CT","name":"Connecticut","cname":"康涅狄格","id":215}},{"code":"GRH","name":"Greenwich","cname":"格林尼治","id":3406,"state":{"code":"CT","name":"Connecticut","cname":"康涅狄格","id":215}},{"code":"HFD","name":"Hartford","cname":"哈特福德","id":3407,"state":{"code":"CT","name":"Connecticut","cname":"康涅狄格","id":215}},{"code":"HVN","name":"New Haven","cname":"纽黑文","id":3408,"state":{"code":"CT","name":"Connecticut","cname":"康涅狄格","id":215}},{"code":"NWT","name":"New Britain","cname":"新不列颠","id":3409,"state":{"code":"CT","name":"Connecticut","cname":"康涅狄格","id":215}},{"code":"WAT","name":"Waterbury","cname":"沃特伯里","id":3410,"state":{"code":"CT","name":"Connecticut","cname":"康涅狄格","id":215}},{"code":"WPT","name":"Westport","cname":"韦斯特波特","id":3411,"state":{"code":"CT","name":"Connecticut","cname":"康涅狄格","id":215}},{"code":"XIN","name":"Middletown","cname":"米德尔顿","id":3412,"state":{"code":"CT","name":"Connecticut","cname":"康涅狄格","id":215}},{"code":"WAS","name":"Washington D.C.","cname":"华盛顿哥伦比亚特区","id":3413,"state":{"code":"DC","name":"District of Columbia","cname":"哥伦比亚特区","id":216}},{"code":"DOR","name":"Dover","cname":"多佛","id":3414,"state":{"code":"DE","name":"Delaware","cname":"特拉华","id":217}},{"code":"ILG","name":"Wilmington","cname":"威明顿","id":3415,"state":{"code":"DE","name":"Delaware","cname":"特拉华","id":217}},{"code":"NWK","name":"Newark","cname":"纽瓦克","id":3416,"state":{"code":"DE","name":"Delaware","cname":"特拉华","id":217}},{"code":"CPV","name":"Cape Canaveral","cname":"卡纳维尔角","id":3417,"state":{"code":"FL","name":"Florida","cname":"佛罗里达","id":218}},{"code":"EYW","name":"Key West","cname":"基韦斯特","id":3418,"state":{"code":"FL","name":"Florida","cname":"佛罗里达","id":218}},{"code":"FLL","name":"Fort Lauderdale","cname":"罗德岱堡","id":3419,"state":{"code":"FL","name":"Florida","cname":"佛罗里达","id":218}},{"code":"JAX","name":"Jacksonville","cname":"杰克逊维尔","id":3420,"state":{"code":"FL","name":"Florida","cname":"佛罗里达","id":218}},{"code":"MIA","name":"Miami","cname":"迈阿密","id":3421,"state":{"code":"FL","name":"Florida","cname":"佛罗里达","id":218}},{"code":"ORL","name":"Orlando","cname":"奥兰多","id":3422,"state":{"code":"FL","name":"Florida","cname":"佛罗里达","id":218}},{"code":"PIE","name":"St. Petersburg","cname":"圣彼德斯堡市","id":3423,"state":{"code":"FL","name":"Florida","cname":"佛罗里达","id":218}},{"code":"TLH","name":"Tallahassee","cname":"塔拉哈西","id":3424,"state":{"code":"FL","name":"Florida","cname":"佛罗里达","id":218}},{"code":"TPA","name":"Tampa","cname":"坦帕","id":3425,"state":{"code":"FL","name":"Florida","cname":"佛罗里达","id":218}},{"code":"AUT","name":"Augusta","cname":"奥古斯塔","id":3426,"state":{"code":"GA","name":"Georgia","cname":"佐治亚","id":219}},{"code":"CZX","name":"Columbus","cname":"哥伦布","id":3427,"state":{"code":"GA","name":"Georgia","cname":"佐治亚","id":219}},{"code":"MCN","name":"Macon","cname":"梅肯","id":3428,"state":{"code":"GA","name":"Georgia","cname":"佐治亚","id":219}},{"code":"SAV","name":"Savannah","cname":"沙瓦纳","id":3429,"state":{"code":"GA","name":"Georgia","cname":"佐治亚","id":219}},{"code":"TAT","name":"Atlanta","cname":"亚特兰大","id":3430,"state":{"code":"GA","name":"Georgia","cname":"佐治亚","id":219}},{"code":"HNL","name":"Honolulu","cname":"檀香山","id":3431,"state":{"code":"HI","name":"Hawaii","cname":"夏威夷","id":220}},{"code":"ITO","name":"Hilo","cname":"希洛","id":3432,"state":{"code":"HI","name":"Hawaii","cname":"夏威夷","id":220}},{"code":"KHH","name":"Kailua","cname":"凯卢阿","id":3433,"state":{"code":"HI","name":"Hawaii","cname":"夏威夷","id":220}},{"code":"CID","name":"Cedar Rapids","cname":"锡达拉皮兹","id":3434,"state":{"code":"IA","name":"Iowa","cname":"爱荷华","id":221}},{"code":"DSM","name":"Des Moines","cname":"得梅因","id":3435,"state":{"code":"IA","name":"Iowa","cname":"爱荷华","id":221}},{"code":"DVN","name":"Davenport","cname":"达文波特","id":3436,"state":{"code":"IA","name":"Iowa","cname":"爱荷华","id":221}},{"code":"BLK","name":"Blackfoot","cname":"布莱克富特","id":3437,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"BOI","name":"Boise","cname":"博伊西","id":3438,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"COE","name":"Coeur d'Alene","cname":"科达伦","id":3439,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"IDA","name":"Idaho Falls","cname":"爱达荷福尔斯","id":3440,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"LWS","name":"Lewiston","cname":"刘易斯顿","id":3441,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"MJL","name":"Moscow","cname":"莫斯科","id":3442,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"NPA","name":"Nampa","cname":"楠帕","id":3443,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"PIH","name":"Pocatello","cname":"波卡特洛","id":3444,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"QKM","name":"Ketchum","cname":"岂彻姆","id":3445,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"SVY","name":"Sun Valley","cname":"森瓦利","id":3446,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"YAF","name":"American Falls","cname":"亚美利加瀑布城","id":3447,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"ZMU","name":"Murphy","cname":"墨菲","id":3448,"state":{"code":"ID","name":"Idaho","cname":"爱达荷","id":222}},{"code":"ALN","name":"Alton","cname":"奥尔顿","id":3449,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"AUZ","name":"Aurora","cname":"奥罗拉","id":3450,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"BLO","name":"Bloomington","cname":"布卢明顿","id":3451,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"CHI","name":"Chicago","cname":"芝加哥","id":3452,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"CMI","name":"Champaign-Urbana","cname":"厄巴纳-香槟","id":3453,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"CRA","name":"Centralia","cname":"森特勒利亚","id":3454,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"DEC","name":"Decatur","cname":"迪凯持","id":3455,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"DEK","name":"De Kalb","cname":"迪卡尔布","id":3456,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"DVI","name":"Danville","cname":"丹维尓","id":3457,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"ESL","name":"East St Louis","cname":"东圣路易斯","id":3458,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"GSU","name":"Galesburg","cname":"盖尔斯堡","id":3459,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"MDH","name":"Carbondale","cname":"卡本代尔","id":3460,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"NOM","name":"Normal","cname":"诺黙尔","id":3461,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"PLA","name":"Peoria","cname":"皮奥里亚","id":3462,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"RFD","name":"Rockford","cname":"罗克福德","id":3463,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"RKI","name":"Rock Island","cname":"罗克艾兰","id":3464,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"SPI","name":"Springfield","cname":"斯普林菲尔德","id":3465,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"UGN","name":"Waukegan","cname":"沃其根","id":3466,"state":{"code":"IL","name":"Illinois","cname":"伊利诺斯","id":223}},{"code":"EVV","name":"Evansville","cname":"埃文斯维尔","id":3467,"state":{"code":"IN","name":"Indiana","cname":"印第安那","id":224}},{"code":"FWA","name":"Fort Wayne","cname":"韦恩堡","id":3468,"state":{"code":"IN","name":"Indiana","cname":"印第安那","id":224}},{"code":"IND","name":"Indianapolis","cname":"印第安纳波利斯","id":3469,"state":{"code":"IN","name":"Indiana","cname":"印第安那","id":224}},{"code":"ABZ","name":"Abilene","cname":"阿比林","id":3470,"state":{"code":"KS","name":"Kansas","cname":"堪萨斯","id":225}},{"code":"HCH","name":"Hutchinson","cname":"哈钦森","id":3471,"state":{"code":"KS","name":"Kansas","cname":"堪萨斯","id":225}},{"code":"ICT","name":"Wichita","cname":"威奇托","id":3472,"state":{"code":"KS","name":"Kansas","cname":"堪萨斯","id":225}},{"code":"KCK","name":"Kansas City","cname":"堪萨斯城","id":3473,"state":{"code":"KS","name":"Kansas","cname":"堪萨斯","id":225}},{"code":"LWC","name":"Lawrence","cname":"劳伦斯","id":3474,"state":{"code":"KS","name":"Kansas","cname":"堪萨斯","id":225}},{"code":"MHK","name":"Manhattan","cname":"曼哈顿","id":3475,"state":{"code":"KS","name":"Kansas","cname":"堪萨斯","id":225}},{"code":"OVL","name":"Overland Park","cname":"奥弗兰公园","id":3476,"state":{"code":"KS","name":"Kansas","cname":"堪萨斯","id":225}},{"code":"TOP","name":"Topeka","cname":"托皮卡","id":3477,"state":{"code":"KS","name":"Kansas","cname":"堪萨斯","id":225}},{"code":"XIA","name":"Leavenworth","cname":"莱文沃思","id":3478,"state":{"code":"KS","name":"Kansas","cname":"堪萨斯","id":225}},{"code":"LEX","name":"Lexington","cname":"列克星敦","id":3479,"state":{"code":"KY","name":"Kentucky","cname":"肯塔基","id":226}},{"code":"LUI","name":"Louisville","cname":"路易斯维尔","id":3480,"state":{"code":"KY","name":"Kentucky","cname":"肯塔基","id":226}},{"code":"OWB","name":"Owensboro","cname":"欧文斯伯勒","id":3481,"state":{"code":"KY","name":"Kentucky","cname":"肯塔基","id":226}},{"code":"BTR","name":"Baton Rouge","cname":"巴吞鲁日","id":3482,"state":{"code":"LA","name":"Louisiana","cname":"路易斯安那","id":227}},{"code":"MSY","name":"New Orleans","cname":"新奥尔良","id":3483,"state":{"code":"LA","name":"Louisiana","cname":"路易斯安那","id":227}},{"code":"SHV","name":"Shreveport","cname":"什里夫波特","id":3484,"state":{"code":"LA","name":"Louisiana","cname":"路易斯安那","id":227}},{"code":"BZD","name":"Boston","cname":"波士顿","id":3485,"state":{"code":"MA","name":"Massachusetts","cname":"马萨诸塞","id":228}},{"code":"ORH","name":"Worcester","cname":"伍斯特","id":3486,"state":{"code":"MA","name":"Massachusetts","cname":"马萨诸塞","id":228}},{"code":"SFY","name":"Springfield","cname":"斯普林菲尔德","id":3487,"state":{"code":"MA","name":"Massachusetts","cname":"马萨诸塞","id":228}},{"code":"BAL","name":"Balitmore","cname":"巴尔的摩","id":3488,"state":{"code":"MD","name":"Maryland","cname":"马里兰","id":229}},{"code":"GAI","name":"Gaithersburg","cname":"盖瑟斯堡","id":3489,"state":{"code":"MD","name":"Maryland","cname":"马里兰","id":229}},{"code":"RKV","name":"Rockville","cname":"罗克维尔","id":3490,"state":{"code":"MD","name":"Maryland","cname":"马里兰","id":229}},{"code":"BNQ","name":"Bangor","cname":"班戈","id":3491,"state":{"code":"ME","name":"Maine","cname":"缅因","id":230}},{"code":"POL","name":"Portland","cname":"波特兰","id":3492,"state":{"code":"ME","name":"Maine","cname":"缅因","id":230}},{"code":"QLW","name":"Lewiston","cname":"刘易斯顿","id":3493,"state":{"code":"ME","name":"Maine","cname":"缅因","id":230}},{"code":"ARB","name":"Ann Arbor","cname":"安娜堡","id":3494,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"AZO","name":"Kalamazoo","cname":"卡拉马袓","id":3495,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"BCY","name":"Bay City","cname":"贝城","id":3496,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"BTL","name":"Battle Creek","cname":"巴特尔克里克","id":3497,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"DEO","name":"Dearborn","cname":"迪尔伯恩","id":3498,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"DET","name":"Detroit","cname":"底特律","id":3499,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"FNT","name":"Flint","cname":"弗林特","id":3500,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"GRR","name":"Grand Rapids","cname":"大急流城","id":3501,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"LAN","name":"Lansing","cname":"兰辛","id":3502,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"MKG","name":"Muskegon","cname":"马斯基根","id":3503,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"PHN","name":"Port Huron","cname":"休伦港","id":3504,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"PTK","name":"Pontiac","cname":"庞菷亚克","id":3505,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"SGM","name":"Saginaw","cname":"萨吉诺","id":3506,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"SSM","name":"Sault Ste Marie","cname":"苏圣玛丽","id":3507,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"WAM","name":"Volyn","cname":"沃伦","id":3508,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"WYD","name":"Wyandotte","cname":"怀恩多特","id":3509,"state":{"code":"MI","name":"Michigan","cname":"密歇根","id":231}},{"code":"MES","name":"Minneapolis","cname":"明尼阿波利斯","id":3510,"state":{"code":"MN","name":"Minnesota","cname":"明尼苏达","id":232}},{"code":"RST","name":"Rochester","cname":"罗切斯特","id":3511,"state":{"code":"MN","name":"Minnesota","cname":"明尼苏达","id":232}},{"code":"STP","name":"Sao Paulo","cname":"圣保罗","id":3512,"state":{"code":"MN","name":"Minnesota","cname":"明尼苏达","id":232}},{"code":"COV","name":"Columbia","cname":"哥伦比亚","id":3513,"state":{"code":"MO","name":"Missouri","cname":"密苏里","id":233}},{"code":"JEF","name":"Jefferson City","cname":"杰佛逊市","id":3514,"state":{"code":"MO","name":"Missouri","cname":"密苏里","id":233}},{"code":"MKC","name":"Kansas City","cname":"堪萨斯城","id":3515,"state":{"code":"MO","name":"Missouri","cname":"密苏里","id":233}},{"code":"SGF","name":"Springfield","cname":"斯普林菲尔德","id":3516,"state":{"code":"MO","name":"Missouri","cname":"密苏里","id":233}},{"code":"STL","name":"San Luis","cname":"圣路易斯","id":3517,"state":{"code":"MO","name":"Missouri","cname":"密苏里","id":233}},{"code":"BIX","name":"Biloxi","cname":"比洛克西","id":3518,"state":{"code":"MS","name":"Mississippi","cname":"密西西比","id":234}},{"code":"GLH","name":"Greenville","cname":"格林维尔","id":3519,"state":{"code":"MS","name":"Mississippi","cname":"密西西比","id":234}},{"code":"GPT","name":"Gulfport","cname":"格尔夫波特","id":3520,"state":{"code":"MS","name":"Mississippi","cname":"密西西比","id":234}},{"code":"HBG","name":"Hattiesburg","cname":"哈蒂斯堡","id":3521,"state":{"code":"MS","name":"Mississippi","cname":"密西西比","id":234}},{"code":"JAN","name":"Jackson","cname":"杰克逊","id":3522,"state":{"code":"MS","name":"Mississippi","cname":"密西西比","id":234}},{"code":"MEI","name":"Meridian","cname":"默里迪恩","id":3523,"state":{"code":"MS","name":"Mississippi","cname":"密西西比","id":234}},{"code":"VKS","name":"Vicksburg","cname":"维克斯堡","id":3524,"state":{"code":"MS","name":"Mississippi","cname":"密西西比","id":234}},{"code":"BGS","name":"Billings","cname":"比灵斯","id":3525,"state":{"code":"MT","name":"Montana","cname":"蒙大拿","id":235}},{"code":"GTF","name":"Great Falls","cname":"大瀑布村","id":3526,"state":{"code":"MT","name":"Montana","cname":"蒙大拿","id":235}},{"code":"MSO","name":"Missoula","cname":"米苏拉","id":3527,"state":{"code":"MT","name":"Montana","cname":"蒙大拿","id":235}},{"code":"AEV","name":"Asheville","cname":"艾许维尔","id":3528,"state":{"code":"NC","name":"North Carolina","cname":"北卡罗来纳","id":236}},{"code":"CHE","name":"Chapel Hill","cname":"教堂山","id":3529,"state":{"code":"NC","name":"North Carolina","cname":"北卡罗来纳","id":236}},{"code":"CRQ","name":"Charlotte","cname":"夏洛特","id":3530,"state":{"code":"NC","name":"North Carolina","cname":"北卡罗来纳","id":236}},{"code":"DHH","name":"Durham","cname":"杜罕","id":3531,"state":{"code":"NC","name":"North Carolina","cname":"北卡罗来纳","id":236}},{"code":"GBO","name":"Greensboro","cname":"格林斯伯勒","id":3532,"state":{"code":"NC","name":"North Carolina","cname":"北卡罗来纳","id":236}},{"code":"RAG","name":"Raleigh","cname":"罗利","id":3533,"state":{"code":"NC","name":"North Carolina","cname":"北卡罗来纳","id":236}},{"code":"RDU","name":"Raleigh-Durham","cname":"洛利杜罕都会区","id":3534,"state":{"code":"NC","name":"North Carolina","cname":"北卡罗来纳","id":236}},{"code":"BIS","name":"Bismarck","cname":"俾斯麦","id":3535,"state":{"code":"ND","name":"North Dakota","cname":"北达科他","id":237}},{"code":"FAR","name":"Fargo","cname":"法戈","id":3536,"state":{"code":"ND","name":"North Dakota","cname":"北达科他","id":237}},{"code":"GFK","name":"Grand Forks","cname":"大福克斯","id":3537,"state":{"code":"ND","name":"North Dakota","cname":"北达科他","id":237}},{"code":"MOT","name":"Minot","cname":"迈诺特","id":3538,"state":{"code":"ND","name":"North Dakota","cname":"北达科他","id":237}},{"code":"LNK","name":"Lincoln","cname":"林肯","id":3539,"state":{"code":"NE","name":"Nebraska","cname":"内布拉斯加","id":238}},{"code":"OMA","name":"Omaha","cname":"奥马哈","id":3540,"state":{"code":"NE","name":"Nebraska","cname":"内布拉斯加","id":238}},{"code":"XDE","name":"Bellevue","cname":"贝尔维尤","id":3541,"state":{"code":"NE","name":"Nebraska","cname":"内布拉斯加","id":238}},{"code":"ASH","name":"Nashua","cname":"纳舒厄","id":3542,"state":{"code":"NH","name":"New Hampshire","cname":"新罕布什尔","id":239}},{"code":"CON","name":"Concord","cname":"康科德","id":3543,"state":{"code":"NH","name":"New Hampshire","cname":"新罕布什尔","id":239}},{"code":"MHT","name":"Manchester","cname":"曼彻斯特","id":3544,"state":{"code":"NH","name":"New Hampshire","cname":"新罕布什尔","id":239}},{"code":"JEC","name":"Jersey City","cname":"泽西城","id":3545,"state":{"code":"NJ","name":"New Jersey","cname":"新泽西","id":240}},{"code":"NRK","name":"Newark","cname":"纽瓦克","id":3546,"state":{"code":"NJ","name":"New Jersey","cname":"新泽西","id":240}},{"code":"PAT","name":"Paterson","cname":"帕特森","id":3547,"state":{"code":"NJ","name":"New Jersey","cname":"新泽西","id":240}},{"code":"ABQ","name":"Albuquerque","cname":"阿尔伯克基","id":3548,"state":{"code":"NM","name":"New Mexico","cname":"新墨西哥","id":241}},{"code":"LRU","name":"Las Cruces","cname":"拉斯克鲁塞斯","id":3549,"state":{"code":"NM","name":"New Mexico","cname":"新墨西哥","id":241}},{"code":"ROW","name":"Roswell","cname":"罗斯韦尔","id":3550,"state":{"code":"NM","name":"New Mexico","cname":"新墨西哥","id":241}},{"code":"SAF","name":"Santa Fe","cname":"圣菲","id":3551,"state":{"code":"NM","name":"New Mexico","cname":"新墨西哥","id":241}},{"code":"CSN","name":"Carson City","cname":"卡森城","id":3552,"state":{"code":"NV","name":"Nevada","cname":"内华达","id":242}},{"code":"EKO","name":"Elko","cname":"埃尔科","id":3553,"state":{"code":"NV","name":"Nevada","cname":"内华达","id":242}},{"code":"HNZ","name":"Henderson","cname":"亨德森","id":3554,"state":{"code":"NV","name":"Nevada","cname":"内华达","id":242}},{"code":"LAS","name":"Las Vegas","cname":"拉斯维加斯","id":3555,"state":{"code":"NV","name":"Nevada","cname":"内华达","id":242}},{"code":"NVS","name":"North Las Vegas","cname":"北拉斯维加斯","id":3556,"state":{"code":"NV","name":"Nevada","cname":"内华达","id":242}},{"code":"RNO","name":"Reno","cname":"里诺","id":3557,"state":{"code":"NV","name":"Nevada","cname":"内华达","id":242}},{"code":"SPK","name":"Sparks","cname":"斯帕克斯","id":3558,"state":{"code":"NV","name":"Nevada","cname":"内华达","id":242}},{"code":"VGI","name":"Virginia City","cname":"弗吉尼亚城","id":3559,"state":{"code":"NV","name":"Nevada","cname":"内华达","id":242}},{"code":"FFO","name":"Buffalo","cname":"布法罗","id":3560,"state":{"code":"NY","name":"New York","cname":"纽约","id":243}},{"code":"QEE","name":"New York","cname":"纽约市","id":3561,"state":{"code":"NY","name":"New York","cname":"纽约","id":243}},{"code":"ROC","name":"Rochester","cname":"罗切斯特","id":3562,"state":{"code":"NY","name":"New York","cname":"纽约","id":243}},{"code":"CLE","name":"Cleveland","cname":"克利夫兰","id":3563,"state":{"code":"OH","name":"Ohio","cname":"俄亥俄","id":244}},{"code":"CVG","name":"Cincinnati","cname":"辛辛那提","id":3564,"state":{"code":"OH","name":"Ohio","cname":"俄亥俄","id":244}},{"code":"CZX","name":"Columbus","cname":"哥伦布","id":3565,"state":{"code":"OH","name":"Ohio","cname":"俄亥俄","id":244}},{"code":"DYT","name":"Dayton","cname":"代顿","id":3566,"state":{"code":"OH","name":"Ohio","cname":"俄亥俄","id":244}},{"code":"TOL","name":"Toledo","cname":"托莱多","id":3567,"state":{"code":"OH","name":"Ohio","cname":"俄亥俄","id":244}},{"code":"OKC","name":"Oklahoma City","cname":"俄克拉荷马城","id":3568,"state":{"code":"OK","name":"Oklahoma","cname":"俄克拉荷马","id":245}},{"code":"OUN","name":"Norman","cname":"诺曼","id":3569,"state":{"code":"OK","name":"Oklahoma","cname":"俄克拉荷马","id":245}},{"code":"TUL","name":"Tulsa","cname":"塔尔萨","id":3570,"state":{"code":"OK","name":"Oklahoma","cname":"俄克拉荷马","id":245}},{"code":"BZO","name":"Bend","cname":"本德","id":3571,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"COB","name":"Coos Bay","cname":"库斯贝","id":3572,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"CTR","name":"Crater Lake","cname":"火山口湖","id":3573,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"DAC","name":"Dallas","cname":"达拉斯","id":3574,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"DLS","name":"The Dalles","cname":"达尔斯","id":3575,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"EUG","name":"Eugene","cname":"尤金","id":3576,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"HDX","name":"Hood River","cname":"胡德里弗","id":3577,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"MFR","name":"Medford","cname":"梅德福","id":3578,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"PDX","name":"Portland","cname":"波特兰","id":3579,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"SLE","name":"Salem","cname":"塞勒姆","id":3580,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"SPY","name":"Springfield","cname":"斯普林菲尔德","id":3581,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"STH","name":"St Helens","cname":"圣海伦斯","id":3582,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"TLM","name":"Tillamook","cname":"蒂拉穆克","id":3583,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"XFX","name":"Grant's Pass","cname":"格兰茨帕斯","id":3584,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"YCV","name":"Corvallis","cname":"科瓦利斯","id":3585,"state":{"code":"OR","name":"Oregon","cname":"俄勒冈","id":246}},{"code":"AEW","name":"Allentown","cname":"阿伦敦","id":3586,"state":{"code":"PA","name":"Pennsylvania","cname":"宾夕法尼亚","id":247}},{"code":"PHL","name":"Philadephia","cname":"费城","id":3587,"state":{"code":"PA","name":"Pennsylvania","cname":"宾夕法尼亚","id":247}},{"code":"PIT","name":"Pittsburgh","cname":"匹兹堡","id":3588,"state":{"code":"PA","name":"Pennsylvania","cname":"宾夕法尼亚","id":247}},{"code":"CQH","name":"Cranston","cname":"克兰斯顿","id":3589,"state":{"code":"RI","name":"Rhode Island","cname":"罗德岛","id":248}},{"code":"NPO","name":"Newport","cname":"纽波特","id":3590,"state":{"code":"RI","name":"Rhode Island","cname":"罗德岛","id":248}},{"code":"PAW","name":"Pawtucket","cname":"波塔基特","id":3591,"state":{"code":"RI","name":"Rhode Island","cname":"罗德岛","id":248}},{"code":"PVD","name":"Providence","cname":"普罗维登斯","id":3592,"state":{"code":"RI","name":"Rhode Island","cname":"罗德岛","id":248}},{"code":"SFN","name":"Woonsocket","cname":"文索基特","id":3593,"state":{"code":"RI","name":"Rhode Island","cname":"罗德岛","id":248}},{"code":"UZO","name":"Warwick","cname":"沃威克","id":3594,"state":{"code":"RI","name":"Rhode Island","cname":"罗德岛","id":248}},{"code":"WST","name":"Westerly","cname":"韦斯特利","id":3595,"state":{"code":"RI","name":"Rhode Island","cname":"罗德岛","id":248}},{"code":"CHS","name":"Charleston","cname":"查尔斯顿","id":3596,"state":{"code":"SC","name":"South Carolina","cname":"南卡罗来纳","id":249}},{"code":"COV","name":"Columbia","cname":"哥伦比亚","id":3597,"state":{"code":"SC","name":"South Carolina","cname":"南卡罗来纳","id":249}},{"code":"NTS","name":"North Charleston","cname":"北查尔斯顿","id":3598,"state":{"code":"SC","name":"South Carolina","cname":"南卡罗来纳","id":249}},{"code":"ABK","name":"Aberdeen","cname":"阿伯丁","id":3599,"state":{"code":"SD","name":"South Dakota","cname":"南达科他","id":250}},{"code":"FSD","name":"Sioux Falls","cname":"苏福尔斯","id":3600,"state":{"code":"SD","name":"South Dakota","cname":"南达科他","id":250}},{"code":"RAP","name":"Rapid City","cname":"拉皮德城","id":3601,"state":{"code":"SD","name":"South Dakota","cname":"南达科他","id":250}},{"code":"BNA","name":"Nashville","cname":"纳什维尔","id":3602,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"BSJ","name":"Bristol","cname":"布利斯托","id":3603,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"CHA","name":"Chattanooga","cname":"查塔努加","id":3604,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"JCY","name":"Johnson City","cname":"约翰逊城","id":3605,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"MEM","name":"Memphis","cname":"孟菲斯","id":3606,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"MQY","name":"Smyrna","cname":"士麦那","id":3607,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"RGI","name":"Spring Hill","cname":"斯普林希尔","id":3608,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"TRI","name":"Kingsport","cname":"金斯波特","id":3609,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"TYS","name":"Knoxville","cname":"诺克斯维尔","id":3610,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"YTC","name":"Tri-City Area","cname":"三城区","id":3611,"state":{"code":"TN","name":"Tennessee","cname":"田纳西","id":251}},{"code":"AUS","name":"Austin","cname":"奥斯汀","id":3612,"state":{"code":"TX","name":"Texas","cname":"德克萨斯","id":252}},{"code":"CRP","name":"Corpus Christi","cname":"哥帕斯基斯蒂","id":3613,"state":{"code":"TX","name":"Texas","cname":"德克萨斯","id":252}},{"code":"DAL","name":"Dallas","cname":"达拉斯","id":3614,"state":{"code":"TX","name":"Texas","cname":"德克萨斯","id":252}},{"code":"ELP","name":"El Paso","cname":"埃尔帕索","id":3615,"state":{"code":"TX","name":"Texas","cname":"德克萨斯","id":252}},{"code":"GLS","name":"Galveston","cname":"交维斯顿","id":3616,"state":{"code":"TX","name":"Texas","cname":"德克萨斯","id":252}},{"code":"HOU","name":"Houston","cname":"休斯敦","id":3617,"state":{"code":"TX","name":"Texas","cname":"德克萨斯","id":252}},{"code":"LRD","name":"Laredo","cname":"拉雷多","id":3618,"state":{"code":"TX","name":"Texas","cname":"德克萨斯","id":252}},{"code":"SAT","name":"San Antonio","cname":"圣安东尼奥","id":3619,"state":{"code":"TX","name":"Texas","cname":"德克萨斯","id":252}},{"code":"TXC","name":"McAllen","cname":"麦亚伦","id":3620,"state":{"code":"TX","name":"Texas","cname":"德克萨斯","id":252}},{"code":"LTJ","name":"Layton","cname":"雷登","id":3621,"state":{"code":"UT","name":"Utah","cname":"犹他","id":253}},{"code":"OEU","name":"Orem","cname":"欧仁","id":3622,"state":{"code":"UT","name":"Utah","cname":"犹他","id":253}},{"code":"OGD","name":"Ogden","cname":"奥格登","id":3623,"state":{"code":"UT","name":"Utah","cname":"犹他","id":253}},{"code":"PAC","name":"Park City","cname":"帕克城","id":3624,"state":{"code":"UT","name":"Utah","cname":"犹他","id":253}},{"code":"PVU","name":"Provo","cname":"普罗沃","id":3625,"state":{"code":"UT","name":"Utah","cname":"犹他","id":253}},{"code":"SGU","name":"St.George","cname":"圣乔治","id":3626,"state":{"code":"UT","name":"Utah","cname":"犹他","id":253}},{"code":"SLC","name":"Salt Lake City","cname":"盐湖城","id":3627,"state":{"code":"UT","name":"Utah","cname":"犹他","id":253}},{"code":"WVC","name":"West Valley City","cname":"西瓦利城","id":3628,"state":{"code":"UT","name":"Utah","cname":"犹他","id":253}},{"code":"HTW","name":"Chesapeake","cname":"切萨皮克","id":3629,"state":{"code":"VA","name":"Virginia","cname":"维吉尼亚","id":254}},{"code":"ORF","name":"Norfolk","cname":"诺福克","id":3630,"state":{"code":"VA","name":"Virginia","cname":"维吉尼亚","id":254}},{"code":"VAB","name":"Virginia Beach","cname":"弗吉尼亚比奇","id":3631,"state":{"code":"VA","name":"Virginia","cname":"维吉尼亚","id":254}},{"code":"BTV","name":"Burlington","cname":"伯灵顿","id":3632,"state":{"code":"VT","name":"Vermont","cname":"佛蒙特","id":255}},{"code":"RUT","name":"Rutland","cname":"拉特兰","id":3633,"state":{"code":"VT","name":"Vermont","cname":"佛蒙特","id":255}},{"code":"ZBR","name":"South Burlington","cname":"南伯灵顿","id":3634,"state":{"code":"VT","name":"Vermont","cname":"佛蒙特","id":255}},{"code":"GEG","name":"Spokane","cname":"斯波坎","id":3635,"state":{"code":"WA","name":"Washington","cname":"华盛顿","id":256}},{"code":"SEA","name":"Seattle","cname":"西雅图","id":3636,"state":{"code":"WA","name":"Washington","cname":"华盛顿","id":256}},{"code":"TTW","name":"Tacoma","cname":"塔科马","id":3637,"state":{"code":"WA","name":"Washington","cname":"华盛顿","id":256}},{"code":"ATW","name":"Appleton","cname":"阿普尓顿","id":3638,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"AUW","name":"Wausau","cname":"沃索","id":3639,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"EAU","name":"Eau Claire","cname":"欧克莱尓","id":3640,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"ENW","name":"Kenosha","cname":"基诺沙","id":3641,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"GBK","name":"Green Bay","cname":"格林贝","id":3642,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"LSE","name":"LaCrosse","cname":"拉克罗斯","id":3643,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"MKE","name":"Milwaukee","cname":"密尔沃基","id":3644,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"MTW","name":"Manitowoc","cname":"马尼托沃克","id":3645,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"OSH","name":"Oshkosh","cname":"奥什科什","id":3646,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"QMD","name":"Madison","cname":"迈迪逊","id":3647,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"RAC","name":"Racine","cname":"拉辛","id":3648,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"SBM","name":"Sheboygan","cname":"希博伊根","id":3649,"state":{"code":"WI","name":"Wisconsin","cname":"威斯康星","id":257}},{"code":"CRW","name":"Charleston","cname":"查尔斯顿","id":3650,"state":{"code":"WV","name":"West Virginia","cname":"西佛吉尼亚","id":258}},{"code":"HNU","name":"Huntington","cname":"亨廷顿","id":3651,"state":{"code":"WV","name":"West Virginia","cname":"西佛吉尼亚","id":258}},{"code":"PKB","name":"Parkersburg","cname":"帕克斯堡","id":3652,"state":{"code":"WV","name":"West Virginia","cname":"西佛吉尼亚","id":258}},{"code":"CPR","name":"Casper","cname":"卡斯珀","id":3653,"state":{"code":"WY","name":"Wyoming","cname":"怀俄明","id":259}},{"code":"CYS","name":"Cheyenne","cname":"夏延","id":3654,"state":{"code":"WY","name":"Wyoming","cname":"怀俄明","id":259}},{"code":"EVD","name":"Evanston","cname":"埃文斯顿","id":3655,"state":{"code":"WY","name":"Wyoming","cname":"怀俄明","id":259}},{"code":"LAR","name":"Laramie","cname":"拉勒米","id":3656,"state":{"code":"WY","name":"Wyoming","cname":"怀俄明","id":259}},{"code":"RKS","name":"Rock Springs","cname":"罗克斯普林斯","id":3657,"state":{"code":"WY","name":"Wyoming","cname":"怀俄明","id":259}},{"code":"SHR","name":"Sheridan","cname":"谢里登","id":3658,"state":{"code":"WY","name":"Wyoming","cname":"怀俄明","id":259}}]
export default locationList