/* ===== Guided: physics, light, electricity, Earth systems =====
   Ordered bilingual step sequences for physics free-play topics (audit 2026-11). Each step presses the model's own buttons. See guided-module.js. */
(function(){const G=window.__vaGuide;if(!G)return;
/* ---------- Light ---------- */
G("ch9/reflection",[
["Light bounces off a mirror","दर्पण से प्रकाश लौटता है","In a plane mirror the angle of incidence equals the angle of reflection (∠i = ∠r), and the incident ray, reflected ray and normal lie in one plane. Drag the bulb and the eye.","समतल दर्पण में आपतन कोण = परावर्तन कोण (∠i = ∠r); आपतित किरण, परावर्तित किरण व अभिलंब एक ही तल में होते हैं; बल्ब व आँख खींचिए।",{},10],
["The image and virtual rays","प्रतिबिंब व आभासी किरणें","Press Image & virtual rays: the eye sees the image behind the mirror, as far behind as the object is in front — virtual, upright, same size.","Image & virtual rays दबाइए: आँख को प्रतिबिंब दर्पण के पीछे उतनी ही दूरी पर दिखता है जितनी वस्तु आगे है — आभासी, सीधा, समान आकार।",{click:["👁 Image & virtual rays"]},12],
["More rays","अधिक किरणें","Extra rays all appear to come from the same image point — that is why the image is clear.","सभी अतिरिक्त किरणें एक ही प्रतिबिंब-बिंदु से आती प्रतीत होती हैं — इसलिए प्रतिबिंब स्पष्ट है।",{click:["↔ Extra rays"]},11],
["Lateral inversion","पार्श्व उलटाव","The image is laterally inverted: left and right swap, so F looks reversed (AMBULANCE is written reversed).","प्रतिबिंब में बाएँ-दाएँ बदल जाते हैं — F उल्टा दिखता है (AMBULANCE उल्टा लिखा जाता है)।",{click:["🔤 Lateral inversion (F)"]},11]]);
G("ch9/optics",[
["Mirrors and lenses make images","दर्पण व लेंस प्रतिबिंब बनाते हैं","Two rays are enough: one parallel to the principal axis (passes through the focus) and one through the centre. Drag the object along the bench.","दो किरणें पर्याप्त हैं: एक मुख्य अक्ष के समांतर (फ़ोकस से), एक केंद्र से; वस्तु को बेंच पर खींचिए।",{click:["Concave mirror"]},10],
["Concave mirror","अवतल दर्पण","Beyond C the image is real, inverted and diminished; between F and the pole it is virtual, upright and magnified (shaving mirror).","C के पार प्रतिबिंब वास्तविक, उलटा, छोटा; F व ध्रुव के बीच आभासी, सीधा, बड़ा (शेविंग दर्पण)।",{click:["Concave mirror"]},12],
["Convex mirror","उत्तल दर्पण","Always gives a virtual, upright, diminished image — wide field of view, used as a rear-view mirror.","सदा आभासी, सीधा, छोटा प्रतिबिंब — दृष्टि-क्षेत्र विस्तृत, पश्च-दर्शी दर्पण।",{click:["Convex mirror"]},12],
["Convex lens","उत्तल लेंस","Converges rays. Image depends on object distance: real and inverted for u > f, virtual and magnified for u < f (magnifying glass).","किरणें अभिसारित करता है; u > f पर वास्तविक, उलटा; u < f पर आभासी, बड़ा (आवर्धक लेंस)।",{click:["Convex lens"]},12],
["Concave lens","अवतल लेंस","Diverges rays; always a virtual, upright, diminished image (used to correct myopia).","किरणें अपसारित करता है; सदा आभासी, सीधा, छोटा प्रतिबिंब (निकट-दृष्टि सुधार)।",{click:["Concave lens"]},12]]);
G("ch9/slab",[
["Light bends at a boundary","सीमा पर प्रकाश मुड़ता है","Light changes speed on entering glass, so it bends: refraction. Entering the denser medium it bends TOWARDS the normal.","काँच में प्रवेश पर प्रकाश की चाल बदलती है, इसलिए वह मुड़ता है — अपवर्तन; सघन माध्यम में अभिलंब की ओर।",{click:["Glass n=1.5"]},11],
["Through a glass slab","काँच के स्लैब से","Drag the torch: the ray bends towards the normal on entering and away from it on leaving, emerging parallel to the incident ray but shifted sideways (lateral displacement).","टॉर्च खींचिए: प्रवेश पर अभिलंब की ओर, निकलते समय दूर मुड़ती है; निर्गत किरण आपतित के समांतर पर पार्श्व में खिसकी (पार्श्व विस्थापन)।",{},12],
["Water and diamond","जल व हीरा","Higher refractive index n = c/v bends light more: water 1.33, glass 1.5, diamond 2.42 (why diamond sparkles).","अधिक अपवर्तनांक n = c/v पर अधिक मोड़: जल 1.33, काँच 1.5, हीरा 2.42 (इसीलिए हीरा चमकता है)।",{click:["Water n=1.33","Diamond n=2.42"]},13],
["Normal incidence","लंबवत आपतन","At i = 0° the ray goes straight through without bending, whatever the medium.","i = 0° पर किरण बिना मुड़े सीधी निकल जाती है।",{click:["i = 0°"]},10],
["Snell's law","स्नेल का नियम","sin i / sin r = n (constant for a pair of media). Measure i and r and verify.","sin i / sin r = n (दो माध्यमों के लिए स्थिर); i व r मापकर जाँचिए।",{click:["Glass n=1.5"]},10]]);
G("ch9/power",[
["Power of a lens","लेंस की क्षमता","Power P = 1/f (f in metres), measured in dioptre (D). A shorter focal length means more bending and more power.","क्षमता P = 1/f (f मीटर में), मात्रक डायोप्टर (D); छोटी फ़ोकस दूरी = अधिक मोड़ = अधिक क्षमता।",{click:["+2 D"]},10],
["Converging lenses","अभिसारी लेंस","+2 D has f = 50 cm; +4 D has f = 25 cm; +5 D has f = 20 cm. Convex lenses have positive power.","+2 D की f = 50 cm; +4 D की 25 cm; +5 D की 20 cm; उत्तल लेंस की क्षमता धनात्मक।",{click:["+4 D","+5 D"]},12],
["Diverging lenses","अपसारी लेंस","−2 D and −4 D concave lenses diverge rays; negative power.","−2 D व −4 D अवतल लेंस किरणें फैलाते हैं; ऋणात्मक क्षमता।",{click:["−2 D","−4 D"]},12],
["Lenses in contact","संपर्क में लेंस","Powers add: P = P₁ + P₂. Add a +2 D lens in contact.","क्षमताएँ जुड़ती हैं: P = P₁ + P₂; +2 D का एक लेंस संपर्क में जोड़िए।",{click:["+2 D","➕ Add +2 D lens in contact"]},12]]);
G("ch10/eye",[
["Focusing on the retina","रेटिना पर फ़ोकस","A normal eye focuses on the retina for both far and near objects: the ciliary muscles change the lens thickness (accommodation). Choose Far, then Near.","सामान्य आँख दूर व पास दोनों वस्तुओं को रेटिना पर फ़ोकस करती है — पक्ष्माभी पेशियाँ लेंस की मोटाई बदलती हैं (समंजन)।",{click:["Far object","Near object"]},12],
["Myopia (short-sightedness)","निकट-दृष्टि दोष","The image of a far object forms in FRONT of the retina — the eyeball is too long or the lens too strong. Far things look blurred.","दूर की वस्तु का प्रतिबिंब रेटिना के आगे बनता है — गोलक लंबा या लेंस अधिक शक्तिशाली; दूर की चीज़ें धुँधली।",{click:["Myopia"]},12],
["Correct with a concave lens","अवतल लेंस से सुधार","A concave (diverging) lens makes the rays diverge slightly so they meet on the retina.","अवतल (अपसारी) लेंस किरणों को थोड़ा फैलाता है ताकि वे रेटिना पर मिलें।",{click:["👓 Correct with spectacles"]},12],
["Hypermetropia (long-sightedness)","दूर-दृष्टि दोष","The image of a near object forms BEHIND the retina — the eyeball is too short. Near things look blurred.","पास की वस्तु का प्रतिबिंब रेटिना के पीछे बनता है — गोलक छोटा; पास की चीज़ें धुँधली।",{click:["Hypermetropia"]},12],
["Correct with a convex lens","उत्तल लेंस से सुधार","A convex (converging) lens helps the rays converge earlier so they meet on the retina.","उत्तल (अभिसारी) लेंस किरणों को पहले मिलाकर रेटिना पर केंद्रित करता है।",{click:["👓 Correct with spectacles"]},12]]);
G("ch10/prism",[
["White light is a mixture","श्वेत प्रकाश मिश्रण है","A prism splits white light into seven colours: VIBGYOR — dispersion. Violet bends the most and red the least, because the refractive index depends on wavelength.","प्रिज़्म श्वेत प्रकाश को सात रंगों (VIBGYOR) में बाँटता है — वर्ण-विक्षेपण; बैंगनी सबसे अधिक, लाल सबसे कम मुड़ता है।",{},12],
["Newton's second prism","न्यूटन का दूसरा प्रिज़्म","Press Recombine: a second, inverted prism brings the colours back together into white light — proof that the colours came from the white light.","Recombine दबाइए: दूसरा उलटा प्रिज़्म रंगों को फिर श्वेत प्रकाश में मिला देता है — रंग श्वेत प्रकाश से ही आए थे।",{click:["🔺🔻 Recombine (2nd prism)"]},12],
["The rainbow","इंद्रधनुष","A rainbow is dispersion by water drops: refraction, internal reflection, and refraction again; the Sun must be behind you.","इंद्रधनुष जल-बूँदों द्वारा वर्ण-विक्षेपण है: अपवर्तन, आंतरिक परावर्तन, फिर अपवर्तन; सूर्य आपके पीछे होना चाहिए।",{},9]]);
G("ch10/scatter",[
["Why is the sky blue?","आकाश नीला क्यों है?","Sunlight is white. Air molecules are much smaller than the wavelength of light and scatter short wavelengths (blue) far more than long ones (red) — Rayleigh scattering.","सूर्य-प्रकाश श्वेत है; वायु के अणु तरंगदैर्ध्य से बहुत छोटे हैं और छोटे तरंगदैर्ध्य (नीला) को लाल से अधिक बिखेरते हैं — रैले प्रकीर्णन।",{click:["☀ Noon"]},13],
["Sunset is red","सूर्यास्त लाल क्यों","At sunset light passes through a much thicker layer of air; most blue is scattered away and mainly red reaches your eye.","सूर्यास्त पर प्रकाश वायु की बहुत मोटी परत से आता है; अधिकांश नीला बिखर जाता है और मुख्यतः लाल पहुँचता है।",{click:["🌇 Sunset"]},13],
["No atmosphere","बिना वायुमंडल","Astronauts see a black sky even in daytime: no air, no scattering.","अंतरिक्ष यात्रियों को दिन में भी काला आकाश दिखता है — हवा नहीं, प्रकीर्णन नहीं।",{click:["🚀 No atmosphere"]},11],
["Danger signals are red","खतरे का संकेत लाल","Red is scattered least, so it is visible from farthest away — used for traffic and danger lights.","लाल सबसे कम बिखरता है, इसलिए सबसे दूर से दिखता है — खतरे की बत्ती में प्रयुक्त।",{},9]]);
G("adv9/microscope",[
["Parts of a compound microscope","संयुक्त सूक्ष्मदर्शी के भाग","Two convex lenses: a short-focus objective forms a magnified real image; the eyepiece magnifies it again. Total M = M_objective × M_eyepiece.","दो उत्तल लेंस: लघु-फ़ोकस अभिदृश्यक बड़ा वास्तविक प्रतिबिंब बनाता है; नेत्रिका उसे फिर बड़ा करती है; कुल M = M_अभि × M_नेत्रिका।",{click:["4× objective"]},11],
["Choose the objective","अभिदृश्यक चुनिए","Rotate the nosepiece: 4× (scanning), 10× (low), 40× (high), 100× (oil immersion).","नोज़पीस घुमाइए: 4× (स्कैनिंग), 10× (निम्न), 40× (उच्च), 100× (तेल-निमज्जन)।",{click:["10× objective","40× objective","100× objective"]},13],
["The eyepiece","नेत्रिका","Change the eyepiece between 10× and 15× to see how total magnification changes.","नेत्रिका 10× व 15× बदलकर कुल आवर्धन में अंतर देखिए।",{click:["Eyepiece 10× / 15×"]},10],
["Ray path","किरण-पथ","Press Ray path: light travels illuminator → condenser → specimen → objective → eyepiece → eye.","Ray path दबाइए: प्रकाश दीपक → संघनित्र → नमूना → अभिदृश्यक → नेत्रिका → आँख।",{set:{"💡 Ray path":true}},13]]);
G("adv9/resolution",[
["Magnification vs resolution","आवर्धन बनाम विभेदन","Magnification makes an image bigger; resolution is the smallest separation at which two points are seen as two. Enlarging a blurry image adds no detail.","आवर्धन प्रतिबिंब बड़ा करता है; विभेदन वह न्यूनतम दूरी है जिस पर दो बिंदु अलग दिखें; धुँधले चित्र को बड़ा करने से विवरण नहीं बढ़ता।",{click:["Human eye"]},11],
["Human eye and light microscope","मानव आँख व प्रकाश सूक्ष्मदर्शी","Eye ≈ 0.1 mm; light microscope ≈ 200 nm (limited by wavelength of light).","आँख ≈ 0.1 mm; प्रकाश सूक्ष्मदर्शी ≈ 200 nm (प्रकाश की तरंगदैर्ध्य से सीमित)।",{click:["Light microscope"]},12],
["Electron microscopes","इलेक्ट्रॉन सूक्ष्मदर्शी","Electrons have a far shorter wavelength: TEM ≈ 0.1 nm (sees inside cells), SEM shows 3-D surfaces.","इलेक्ट्रॉन की तरंगदैर्ध्य बहुत छोटी: TEM ≈ 0.1 nm (कोशिका के भीतर), SEM त्रिविम सतह दिखाता है।",{click:["TEM (electron)","SEM (electron)"]},13],
["Separate two points","दो बिंदु अलग कीजिए","Make the separation smaller and larger: below the resolving limit the two points merge into one blur.","बिंदुओं की दूरी घटाइए-बढ़ाइए: विभेदन-सीमा से कम पर दोनों एक धब्बा बन जाते हैं।",{click:["Separation smaller","Separation larger"]},12],
["Digital zoom does not help","डिजिटल ज़ूम बेकार","Digital zoom ×2 makes the blur bigger but cannot split the points.","डिजिटल ज़ूम ×2 धब्बे को बड़ा करता है पर बिंदु अलग नहीं कर सकता।",{click:["Digital zoom ×2","Zoom reset"]},11]]);
/* ---------- Electricity ---------- */
G("ch11/ohm",[
["V ∝ I","V ∝ I","Ohm's law: at constant temperature the current through a conductor is proportional to the potential difference, V = IR.","ओम का नियम: स्थिर ताप पर चालक में धारा विभवांतर के समानुपाती, V = IR।",{click:["Clear graph","R = 2 Ω"]},10],
["Close the circuit","परिपथ पूरा कीजिए","Key ON, add cells one at a time and note the ammeter and voltmeter readings: each is plotted on the V–I graph.","Key ON कीजिए, एक-एक सेल जोड़ते हुए धारामापी व वोल्टमीटर पाठ नोट कीजिए — V–I आरेख बनता है।",{click:["+ cell","+ cell","+ cell"]},14],
["A straight line","सरल रेखा","V–I graph is a straight line through the origin: the slope is the resistance.","V–I आरेख मूल-बिंदु से जाती सरल रेखा है; ढाल प्रतिरोध है।",{},9],
["Change the resistor","प्रतिरोधक बदलिए","With a larger R the same voltage gives a smaller current (steeper line).","बड़े R पर समान वोल्टता से कम धारा (अधिक ढाल)।",{click:["R = 4 Ω","+ cell","R = 6 Ω","+ cell"]},13],
["Current direction","धारा की दिशा","Conventional current flows from + to −; electrons actually move from − to +.","परंपरागत धारा + से − की ओर; इलेक्ट्रॉन वास्तव में − से + की ओर।",{click:["➡ Conventional current"]},10]]);
G("ch11/resistance",[
["What decides resistance?","प्रतिरोध किस पर निर्भर?","R = ρ l / A: it depends on the length l, cross-section area A, the material (resistivity ρ) and temperature.","R = ρ l / A: लंबाई l, अनुप्रस्थ-काट क्षेत्रफल A, पदार्थ (प्रतिरोधकता ρ) व ताप पर निर्भर।",{click:["l = 10 m","A = 0.2 mm²","Copper"]},11],
["Length","लंबाई","Doubling the length doubles the resistance, so the current halves.","लंबाई दोगुनी = प्रतिरोध दोगुना, धारा आधी।",{click:["l = 20 m","l = 30 m"]},11],
["Area","क्षेत्रफल","A thicker wire (larger A) has less resistance, so more current flows.","मोटा तार (अधिक A) = कम प्रतिरोध, अधिक धारा।",{click:["l = 10 m","A = 0.1 mm²","A = 0.4 mm²"]},12],
["Material","पदार्थ","Copper conducts best, aluminium less, iron poorly: this is why house wires are copper.","ताँबा सबसे अच्छा चालक, ऐल्युमिनियम कम, लोहा कमज़ोर — इसीलिए घरों में ताँबे के तार।",{click:["Copper","Aluminium","Iron"]},13]]);
G("ch11/series",[
["Three resistors, one battery","तीन प्रतिरोधक, एक बैटरी","R₁ = 1 Ω, R₂ = 2 Ω, R₃ = 3 Ω with a 6 V battery. We connect them in two different ways.","R₁ = 1 Ω, R₂ = 2 Ω, R₃ = 3 Ω, बैटरी 6 V; इन्हें दो तरह से जोड़ेंगे।",{click:["Series"]},9],
["Series","श्रेणीक्रम","Same current through all; voltage divides. R = R₁ + R₂ + R₃ = 6 Ω, so I = 1 A. If one breaks, all stop.","सभी में समान धारा; विभव बँटता है; R = 1 + 2 + 3 = 6 Ω, I = 1 A; एक टूटे तो सब बंद।",{click:["Series"]},12],
["Parallel","पार्श्वक्रम","Same voltage across each; current divides. 1/R = 1/1 + 1/2 + 1/3, so R ≈ 0.55 Ω and the total current is large.","प्रत्येक पर समान वोल्टता, धारा बँटती है; 1/R = 1/1 + 1/2 + 1/3, R ≈ 0.55 Ω; कुल धारा अधिक।",{click:["Parallel"]},13],
["Remove one resistor","एक प्रतिरोधक हटाइए","In parallel the others keep working — this is how houses are wired. Press Remove R₂.","पार्श्व में बाकी चलते रहते हैं — घरों में यही जोड़ है; Remove R₂ दबाइए।",{click:["✂ Remove R₂"]},12]]);
G("ch11/heating",[
["Electricity makes heat","विद्युत से ऊष्मा","Joule's law: H = I²Rt. A 20 Ω coil heats the water; the thermometer rises.","जूल का नियम: H = I²Rt; 20 Ω कुंडली जल गरम करती है।",{click:["1 A"]},11],
["Double the current","धारा दोगुनी","Heat depends on I²: doubling the current gives FOUR times the heat.","ऊष्मा I² पर निर्भर: धारा दोगुनी = ऊष्मा चार गुनी।",{click:["2 A"]},12],
["Three amperes","3 A","Tripling the current gives nine times the heat.","धारा तीन गुनी = ऊष्मा नौ गुनी।",{click:["3 A"]},11],
["Overload and the fuse","अतिभार व फ़्यूज़","At 6 A the fuse wire melts and breaks the circuit — protecting appliances. Replace the fuse.","6 A पर फ़्यूज़-तार पिघलकर परिपथ तोड़ देता है — उपकरण सुरक्षित; फ़्यूज़ बदलिए।",{click:["6 A (overload)"]},12],
["Replace the fuse","फ़्यूज़ बदलिए","Always replace a fuse with the same rating, never with a thick wire.","फ़्यूज़ सदा समान रेटिंग का बदलें, मोटा तार कभी नहीं।",{click:["1 A","🔧 Replace fuse"]},9]]);
G("ch12/domestic",[
["Live, neutral and earth","लाइव, न्यूट्रल व अर्थ","Red live wire (220 V), black neutral, green earth. All appliances are connected in parallel between live and neutral. Tap an appliance to switch it on.","लाल लाइव (220 V), काला न्यूट्रल, हरा अर्थ; सभी उपकरण लाइव-न्यूट्रल के बीच पार्श्व में; उपकरण पर टैप कर चालू कीजिए।",{click:["↺ Reset MCB"]},12],
["Overloading","अतिभार","Too many appliances draw a large total current; the MCB/fuse trips.","बहुत से उपकरण चलाने पर कुल धारा अधिक — MCB/फ़्यूज़ कट जाता है।",{},10],
["Short circuit","लघु परिपथ","If live touches neutral, resistance is almost zero and a huge current flows — the MCB trips immediately.","लाइव व न्यूट्रल छू जाएँ तो प्रतिरोध लगभग शून्य, भारी धारा — MCB तुरंत कटता है।",{click:["⚡ Short circuit"]},12],
["Earth fault","अर्थ दोष","If live touches a metal body, you can get a shock — the earth wire carries the current to the ground and trips the MCB.","लाइव धातु की देह छू जाए तो झटका लग सकता है — अर्थ तार धारा भूमि में भेजकर MCB काटता है।",{click:["↺ Reset MCB","🔩 Earth fault (iron)"]},12],
["Reset the MCB","MCB रीसेट","After removing the fault, reset the MCB. Always connect the earth wire to metal appliances.","दोष हटाकर MCB रीसेट कीजिए; धातु उपकरणों में अर्थ तार अवश्य जोड़ें।",{click:["↺ Reset MCB"]},10]]);
/* ---------- Magnetism ---------- */
G("ch12/magnet",[
["Field of a bar magnet","छड़ चुंबक का क्षेत्र","A magnet has a field around it. Iron filings show its pattern.","चुंबक के चारों ओर चुंबकीय क्षेत्र होता है; लौह-चूर्ण उसका पैटर्न दिखाते हैं।",{set:{"▒ Iron filings":true,"〰 Field lines":false,"🧭 Compass":false}},11],
["Field lines","क्षेत्र रेखाएँ","Field lines leave the north pole and enter the south pole outside the magnet; they never cross; crowded lines mean a strong field.","क्षेत्र रेखाएँ बाहर उत्तरी ध्रुव से निकलकर दक्षिणी में प्रवेश करती हैं; कभी नहीं कटतीं; घनी रेखाएँ = प्रबल क्षेत्र।",{set:{"▒ Iron filings":true,"〰 Field lines":true,"🧭 Compass":false}},12],
["The compass","दिशासूचक","A compass needle lines up with the field. Drag it around the magnet.","दिशासूचक सुई क्षेत्र की दिशा में रुकती है; इसे चुंबक के चारों ओर खींचिए।",{set:{"▒ Iron filings":true,"〰 Field lines":true,"🧭 Compass":true}},12],
["Flip the magnet","चुंबक पलटिए","Reverse the poles: the lines and compass needles reverse direction too.","ध्रुव उलटिए: रेखाएँ व सुइयाँ भी उलट जाती हैं।",{click:["⇄ Flip magnet"]},10]]);
G("ch12/field",[
["A current makes a magnetic field","धारा से चुंबकीय क्षेत्र","Oersted (1820): a wire carrying current deflects a compass. Press Tap the cardboard to see the circular pattern of iron filings.","ओर्स्टेड (1820): धारावाही तार दिशासूचक को विक्षेपित करता है; Tap the cardboard से लौह-चूर्ण का वृत्ताकार पैटर्न देखिए।",{click:["👆 Tap the cardboard"]},12],
["Circular field lines","वृत्ताकार क्षेत्र रेखाएँ","Around a straight wire the field lines are concentric circles. Switch on Field lines.","सीधे तार के चारों ओर क्षेत्र रेखाएँ संकेंद्री वृत्त हैं; Field lines चालू कीजिए।",{set:{"Field lines":true}},11],
["Right-hand thumb rule","दाहिने हाथ का अँगूठा नियम","Thumb along the current, curled fingers show the field direction. Reverse the current and the compass flips.","अँगूठा धारा की दिशा में, मुड़ी उँगलियाँ क्षेत्र की दिशा; धारा उलटने पर सुई भी पलटती है।",{set:{"Field lines":true,"Compasses":true},click:["⇅ Reverse current"]},12],
["More current, stronger field","अधिक धारा, प्रबल क्षेत्र","The field is stronger with more current and weaker farther from the wire.","धारा बढ़ाने पर क्षेत्र प्रबल, तार से दूर होने पर क्षीण।",{click:["⚡ More current"]},11]]);
G("ch12/solenoid",[
["Field of a loop","वृत्ताकार लूप का क्षेत्र","A current loop gives circular field lines that become straight at the centre; each turn adds to the field.","धारावाही लूप के क्षेत्र की रेखाएँ केंद्र पर सीधी; हर फेरा क्षेत्र बढ़ाता है।",{click:["⭕ Circular loop"]},11],
["Solenoid","परिनालिका","Many turns close together make a solenoid with a field like a bar magnet: uniform and strong inside.","अनेक पास-पास फेरे परिनालिका बनाते हैं; क्षेत्र छड़ चुंबक जैसा, भीतर एकसमान व प्रबल।",{click:["🌀 Solenoid"]},12],
["Reverse the current","धारा उलटिए","Poles swap: north and south ends reverse.","ध्रुव बदल जाते हैं — उत्तरी-दक्षिणी सिरे पलटते हैं।",{click:["⇅ Reverse current"]},10],
["Soft-iron core: electromagnet","नर्म लोहे की क्रोड: विद्युत चुंबक","A soft-iron core greatly strengthens the field — an electromagnet, magnetic only while current flows (cranes, bells, MRI).","नर्म लोहे की क्रोड क्षेत्र बहुत बढ़ाती है — विद्युत चुंबक, धारा रहने तक ही चुंबक (क्रेन, घंटी, MRI)।",{click:["🔩 Soft-iron core"]},12]]);
G("ch12/flhr",[
["A force on a current","धारा पर बल","A current-carrying rod in a magnetic field feels a force (Ampère). Next we switch the current on and the rod swings.","चुंबकीय क्षेत्र में धारावाही छड़ पर बल लगता है; अगले चरण में धारा चालू होगी और छड़ हिलेगी।",{},11],
["Fleming's left-hand rule","फ़्लेमिंग का बायाँ हाथ नियम","Left hand: First finger = Field, seCond finger = Current, thuMb = Motion (force). All mutually perpendicular.","बायाँ हाथ: तर्जनी = क्षेत्र, मध्यमा = धारा, अँगूठा = गति (बल); तीनों परस्पर लंबवत।",{click:["⇄ Reverse current"]},12],
["Reverse the current","धारा उलटिए","The force reverses: the rod swings the other way.","बल उलटता है — छड़ दूसरी ओर हिलती है।",{click:["⇄ Reverse current"]},11],
["Flip the magnet","चुंबक पलटिए","Reversing the field also reverses the force.","क्षेत्र उलटने पर भी बल उलटता है।",{click:["🧲 Flip magnet"]},11],
["Double the current","धारा दोगुनी","A stronger current gives a larger force.","अधिक धारा = अधिक बल।",{click:["⚡ Double the current"]},10]]);
G("ch12/motor",[
["Motor: electricity → motion","मोटर: विद्युत → गति","A coil in a magnetic field with current gets forces on opposite sides in opposite directions, so it rotates.","चुंबकीय क्षेत्र में धारावाही कुंडली की सम्मुख भुजाओं पर विपरीत बल लगते हैं — कुंडली घूमती है।",{click:["⚙ Motor"]},13],
["Split-ring commutator","विभक्त वलय दिक्परिवर्तक","The split ring reverses the current every half turn so the coil keeps turning the same way.","विभक्त वलय हर आधे चक्कर पर धारा उलटता है ताकि कुंडली एक ही दिशा में घूमती रहे।",{},11],
["Generator: motion → electricity","जनित्र: गति → विद्युत","Turn the coil in the field: the changing flux induces a current (Faraday).","क्षेत्र में कुंडली घुमाइए: बदलता फ्लक्स धारा प्रेरित करता है (फ़ैराडे)।",{click:["🔄 Generator"]},13],
["AC or DC","AC या DC","Slip rings give alternating current (AC); a split ring gives direct current (DC). Switch to compare.","स्लिप-रिंग प्रत्यावर्ती (AC), विभक्त वलय दिष्ट (DC) धारा देता है; बदलकर तुलना कीजिए।",{click:["AC (slip rings) / DC (split ring)"]},12]]);
G("ch12/induction",[
["Magnet and coil","चुंबक व कुंडली","Faraday: a changing magnetic field through a coil induces a current. Drag the magnet in and out.","फ़ैराडे: कुंडली से गुज़रता बदलता चुंबकीय क्षेत्र धारा प्रेरित करता है; चुंबक अंदर-बाहर खींचिए।",{click:["⟲ Reset","▶ Auto move in / out"]},13],
["Only while it moves","केवल गति के समय","The galvanometer needle deflects only while the magnet moves; stationary magnet — zero current.","चुंबक चलते समय ही धारामापी विक्षेपित; स्थिर चुंबक पर शून्य।",{},10],
["Flip the poles","ध्रुव पलटिए","Reversing the pole reverses the direction of the induced current (Lenz).","ध्रुव उलटने पर प्रेरित धारा की दिशा उलटती है (लेंज़)।",{click:["⇄ Flip poles"]},11],
["More turns","अधिक फेरे","5, 10, 20 turns: more turns give a larger induced current.","5, 10, 20 फेरे: अधिक फेरे = अधिक प्रेरित धारा।",{click:["5 turns","10 turns","20 turns"]},13]]);
/* ---------- Mechanics ---------- */
G("ix9/line",[
["Motion along a line","सरल रेखा में गति","Set u and a, press Run. The car moves together with s–t, v–t and a–t graphs.","u व a चुनकर Run दबाइए; गाड़ी के साथ s–t, v–t, a–t आरेख बनते हैं।",{click:["⟲ Reset","▶ Run / pause"]},13],
["Uniform velocity","एकसमान वेग","With a = 0 the v–t graph is horizontal and the s–t graph is a straight line.","a = 0 पर v–t क्षैतिज और s–t सरल रेखा।",{click:["⟲ Reset","▶ Run / pause"]},12],
["Uniform acceleration","एकसमान त्वरण","Add a: v–t becomes a sloping line (slope = a) and s–t a parabola.","a बढ़ाइए: v–t ढलानदार (ढाल = a) और s–t परवलय।",{click:["⟲ Reset","a + 1 m/s²","a + 1 m/s²","▶ Run / pause"]},14],
["Negative acceleration","ऋणात्मक त्वरण","Retardation: velocity decreases, the car slows to rest.","मंदन: वेग घटता है और गाड़ी रुकती है।",{click:["⟲ Reset","a − 1 m/s²","a − 1 m/s²","▶ Run / pause"]},13],
["Equations of motion","गति के समीकरण","v = u + at · s = ut + ½at² · v² = u² + 2as. Area under the v–t graph = displacement.","v = u + at · s = ut + ½at² · v² = u² + 2as; v–t आरेख का क्षेत्रफल = विस्थापन।",{},10]]);
G("ix9/circular",[
["Circular motion","वृत्तीय गति","A ball moves in a circle at constant speed: its direction changes continuously, so its velocity changes — it has acceleration.","गेंद नियत चाल से वृत्त में घूमती है; दिशा लगातार बदलती है, इसलिए वेग बदलता है — त्वरण है।",{set:{"Vectors":false},click:["Reset"]},11],
["Show the vectors","सदिश दिखाइए","Velocity is tangent to the circle; the acceleration (centripetal) points to the centre.","वेग स्पर्शरेखा के अनुदिश; त्वरण (अभिकेंद्र) केंद्र की ओर।",{set:{"Vectors":true}},12],
["Faster","अधिक वेग","a = v²/r: increasing v increases the centripetal acceleration (and force).","a = v²/r: v बढ़ने पर अभिकेंद्र त्वरण (व बल) बढ़ता है।",{set:{"Vectors":true},click:["v + 0.5 m/s","v + 0.5 m/s"]},12],
["Larger radius","बड़ा त्रिज्या","At the same speed a larger radius gives a smaller acceleration.","समान चाल पर बड़ी त्रिज्या = कम त्वरण।",{set:{"Vectors":true},click:["r + 0.4 m","r + 0.4 m"]},12]]);
G("ix10/forces",[
["Forces change motion","बल गति बदलते हैं","Newton's three laws: inertia, F = ma and action–reaction. Start with friction.","न्यूटन के तीन नियम: जड़त्व, F = ma, क्रिया-प्रतिक्रिया; घर्षण से शुरू।",{click:["Friction & motion","⟲ Reset"]},9],
["Friction","घर्षण","Push the block: until F beats static friction it does not move (balanced forces). Try ice, wood and a rough surface.","ब्लॉक को धकेलिए: जब तक F स्थैतिक घर्षण से कम है, वह नहीं हिलता (संतुलित बल); बर्फ़, लकड़ी, खुरदरी सतह आज़माइए।",{click:["Ice surface","Wood surface","Rough surface","F + 5 N","F + 5 N"]},14],
["F = ma","F = ma","For the same force a larger mass gives a smaller acceleration.","समान बल पर अधिक द्रव्यमान = कम त्वरण।",{click:["Mass +1 kg","F + 5 N"]},12],
["Action and reaction","क्रिया-प्रतिक्रिया","Two carts pushed apart by a spring move in opposite directions with equal and opposite forces.","स्प्रिंग से धकेली दो गाड़ियाँ विपरीत दिशा में, समान व विपरीत बलों से चलती हैं।",{click:["Action–reaction","▶ Release spring / stop cart"]},13],
["Inertia","जड़त्व","A body at rest stays at rest, and a moving body keeps moving, unless a net force acts: seat-belts, shaking dust off a carpet.","विराम की वस्तु विराम में और गतिमान गति में रहती है जब तक असंतुलित बल न लगे: सीट-बेल्ट, कालीन झाड़ना।",{click:["Inertia"]},12]]);
G("ix10/trolley",[
["Verify F = ma","F = ma सत्यापित कीजिए","Practical 12: a trolley is pulled by a hanging mass. Total mass stays 1.0 kg; moving mass to the hanger raises the force.","प्रयोग 12: हैंगर का द्रव्यमान गाड़ी को खींचता है; कुल द्रव्यमान 1.0 kg रहता है; हैंगर में द्रव्यमान बढ़ाने पर बल बढ़ता है।",{click:["Clear data"]},10],
["Release the trolley","गाड़ी छोड़िए","Release and record the acceleration for the first hanger mass.","छोड़कर पहले द्रव्यमान का त्वरण नोट कीजिए।",{click:["▶ Release trolley"]},12],
["Increase the force","बल बढ़ाइए","Add 50 g to the hanger and release again: the acceleration increases in proportion.","हैंगर में 50 g जोड़कर फिर छोड़िए: त्वरण अनुपात में बढ़ता है।",{click:["Hanger +50 g","▶ Release trolley"]},13],
["a ∝ F","a ∝ F","Repeat: the data points fall on a straight line — acceleration is proportional to force for constant mass.","दोहराइए: बिंदु सरल रेखा पर आते हैं — स्थिर द्रव्यमान पर त्वरण बल के समानुपाती।",{click:["Hanger +50 g","▶ Release trolley"]},13]]);
G("ix11/energy",[
["Energy changes form","ऊर्जा रूप बदलती है","Free fall: potential energy changes into kinetic energy and the total stays constant. Press Release.","मुक्त पतन: स्थितिज ऊर्जा गतिज में बदलती है, कुल स्थिर; Release दबाइए।",{click:["Free fall","⟲ Reset","▶ Release / push"]},13],
["The pendulum","सरल लोलक","At the top all PE, at the bottom all KE: the energy swaps back and forth.","शीर्ष पर पूरी PE, तल पर पूरी KE — ऊर्जा आगे-पीछे बदलती रहती है।",{click:["Simple pendulum","⟲ Reset","▶ Release / push"]},14],
["Work and power","कार्य व शक्ति","W = F × s (when the displacement is along the force); power P = W/t. Add force and push.","W = F × s; शक्ति P = W/t; बल बढ़ाकर धकेलिए।",{click:["Work & power","⟲ Reset","Force +10 N","▶ Release / push"]},14],
["Higher means more energy","अधिक ऊँचाई = अधिक ऊर्जा","PE = mgh: raising the height raises the energy available.","PE = mgh: ऊँचाई बढ़ने पर ऊर्जा बढ़ती है।",{click:["Free fall","⟲ Reset","Height / angle +","▶ Release / push"]},13]]);
G("ix11/machines",[
["Simple machines","सरल मशीनें","Lever, inclined plane and pulley make work easier by changing the size or direction of the effort. M.A. = load ÷ effort.","उत्तोलक, आनत तल व घिरनी बल का परिमाण/दिशा बदलकर कार्य आसान करते हैं; यांत्रिक लाभ = भार ÷ प्रयास।",{click:["Lever"]},11],
["Lever","उत्तोलक","Balance load and effort by moving the fulcrum: load × load arm = effort × effort arm (principle of moments).","आधार खिसकाकर संतुलन: भार × भार-भुजा = प्रयास × प्रयास-भुजा (आघूर्ण का सिद्धांत)।",{click:["Lever","⚖ Balance it"]},13],
["Inclined plane","आनत तल","A longer, gentler ramp needs less effort but the load must travel farther (work is the same).","लंबी, कम ढाल वाली ढलान में कम प्रयास पर दूरी अधिक (कार्य समान)।",{click:["Inclined plane","Ramp longer / shorter"]},13],
["Pulleys","घिरनियाँ","A fixed pulley changes the direction of the force; a movable pulley halves the effort.","स्थिर घिरनी बल की दिशा बदलती है; चल घिरनी प्रयास आधा करती है।",{click:["Pulleys","Pulley: next type","Pulley: next type"]},13]]);
G("adv1/measure",[
["Measurement and units","मापन व मात्रक","Measurement compares an unknown quantity with a standard unit: Q = n × u. Change the unit and n changes, but the quantity stays the same.","मापन अज्ञात राशि की मानक मात्रक से तुलना है: Q = n × u; मात्रक बदलने पर n बदलता है, राशि वही।",{click:["Ruler & units"]},11],
["Next unit","अगला मात्रक","Step through units: cm, m, km … the number changes but not the length.","मात्रक बदलिए: cm, m, km … संख्या बदलती है, लंबाई नहीं।",{click:["Next unit","Next unit","Next object"]},12],
["Unit conversion","मात्रक रूपांतरण","Convert using factors, e.g. 1 km = 1000 m.","गुणक से रूपांतरण, जैसे 1 km = 1000 m।",{click:["Unit conversion","Next conversion problem"]},13],
["Seven SI base units","सात SI आधार मात्रक","metre, kilogram, second, ampere, kelvin, mole, candela.","मीटर, किलोग्राम, सेकंड, ऐम्पियर, केल्विन, मोल, कैंडेला।",{click:["Seven SI base units"]},11],
["Estimate vs measure","अनुमान बनाम मापन","Estimate first, then measure: a good scientist checks the estimate.","पहले अनुमान, फिर मापन — अच्छा वैज्ञानिक अनुमान जाँचता है।",{click:["Estimate vs measure"]},11]]);
G("adv2/frame",[
["Frames of reference","निर्देश तंत्र","Motion is relative: to a passenger the ball in a train is at rest, to the ground observer it moves. Switch the observer.","गति सापेक्ष है: यात्री को गेंद विराम में, भूमि-दर्शक को गतिमान; दर्शक बदलिए।",{click:["Frames of reference","👁 Ground ⇄ train observer"]},12],
["Non-inertial frame","अजड़त्वीय तंत्र","When the train accelerates a pseudo force appears in the train frame.","ट्रेन त्वरित होने पर ट्रेन के तंत्र में छद्म बल दिखता है।",{click:["🚂 Train accelerates (non-inertial)"]},12],
["Vector addition","सदिश जोड़","Add vectors head-to-tail; change the magnitude and angle of B.","सदिश सिर-से-पूँछ जोड़िए; B का परिमाण व कोण बदलिए।",{click:["Vector addition","B magnitude +","Angle +15°"]},13],
["Distance vs displacement","दूरी बनाम विस्थापन","Distance is the total path length (scalar); displacement is the straight line from start to end (vector).","दूरी पथ की कुल लंबाई (अदिश); विस्थापन आरंभ से अंत तक सरल रेखा (सदिश)।",{click:["Route: distance & displacement"]},12],
["The nth second","n-वाँ सेकंड","Distance in the nth second: s_n = u + a(2n − 1)/2.","n-वें सेकंड में दूरी: s_n = u + a(2n − 1)/2।",{click:["nth-second distance","n + 1"]},12]]);
G("adv3/gravity",[
["g changes with place","g स्थान से बदलता है","g = GM/R². It decreases above the Earth's surface and (linearly) below.","g = GM/R²; पृथ्वी के ऊपर घटता है और भीतर रैखिक रूप से घटता है।",{click:["g with height / depth"]},11],
["Higher and deeper","ऊपर व नीचे","Go higher (+R/4): g falls. Go deeper (−R/4): g also falls, reaching zero at the centre.","ऊपर (+R/4): g घटता है; नीचे (−R/4): g घटता है, केंद्र पर शून्य।",{click:["↑ Higher (+R/4)","↓ Deeper (−R/4)"]},13],
["Drop test","गिराने का प्रयोग","In a vacuum a feather and a stone fall together; in air the larger area slows the feather.","निर्वात में पंख व पत्थर साथ गिरते हैं; वायु में अधिक क्षेत्रफल पंख को धीमा करता है।",{click:["Drop test (area)","Air ⇄ vacuum","▶ Drop"]},13],
["Torque","बल-आघूर्ण","Torque = force × perpendicular distance: a longer lever arm needs less force.","आघूर्ण = बल × लंबवत दूरी: लंबी भुजा पर कम बल।",{click:["Torque on a door","Lever arm +0.4 m","Force +10 N"]},13]]);
G("adv3/pseudo",[
["Pseudo force","छद्म बल","In an accelerating frame we add F = −ma to apply Newton's laws.","त्वरित तंत्र में न्यूटन के नियम लगाने हेतु F = −ma जोड़ते हैं।",{click:["Bus"]},11],
["Bus","बस","When a bus accelerates forward passengers feel thrown backward.","बस आगे त्वरित हो तो यात्री पीछे धकेले-से लगते हैं।",{click:["Bus","a + 1 m/s²"]},11],
["Lift","लिफ़्ट","Accelerating up makes you feel heavier; accelerating down lighter.","ऊपर त्वरण पर भारी, नीचे पर हल्का महसूस होता है।",{click:["Lift","a + 1 m/s²"]},11],
["Orbit and bob","कक्षा व लोलक","In the Sun–Earth frame the centrifugal pseudo force balances gravity; a bob hangs at an angle in an accelerating cart.","सूर्य-पृथ्वी तंत्र में अपकेंद्री छद्म बल गुरुत्व को संतुलित करता है; त्वरित गाड़ी में लोलक कोण पर लटकता है।",{click:["Sun–Earth orbit","Bob on thread"]},12],
["Ground view","भूमि का दृश्य","From the ground no pseudo force is needed.","भूमि से देखने पर छद्म बल की आवश्यकता नहीं।",{click:["👁 Ground ⇄ moving frame"]},11]]);
G("adv4/machines",[
["Wheel and axle","पहिया व धुरी","A small effort at the large wheel turns the axle against a big load: M.A. = R/r.","बड़े पहिये पर छोटा प्रयास धुरी पर भारी भार घुमाता है: यांत्रिक लाभ = R/r।",{click:["Wheel & axle"]},11],
["Change the radii","त्रिज्या बदलिए","Larger wheel or smaller axle increases M.A.","बड़ा पहिया/छोटी धुरी = अधिक यांत्रिक लाभ।",{click:["Wheel radius +5 cm","Axle radius −1 cm"]},12],
["Gear train","गियर शृंखला","Meshing gears change speed and torque: the smaller gear turns faster.","जुड़े गियर चाल व बल-आघूर्ण बदलते हैं; छोटा गियर तेज़ घूमता है।",{click:["Gear train"]},12],
["Atwood pulley","ऐटवुड घिरनी","Two masses over a pulley: a = (m₂ − m₁)g/(m₁ + m₂).","घिरनी पर दो द्रव्यमान: a = (m₂ − m₁)g/(m₁ + m₂)।",{click:["Atwood pulley","m₂ +1 kg","▶ Run / pull"]},13],
["Real machines","वास्तविक मशीन","With friction efficiency η = 80 %: useful work output is less than input.","घर्षण से दक्षता η = 80 %: उपयोगी कार्य निवेश से कम।",{click:["Real machine (η = 80 %)"]},11]]);
G("adv5/spring",[
["Hooke's law","हुक का नियम","Within the elastic limit F = kx. Hang masses and watch the force–extension graph.","प्रत्यास्थ सीमा में F = kx; द्रव्यमान लटकाकर बल-विस्तार आरेख देखिए।",{click:["Hooke’s law","+100 g"]},12],
["Stiffer spring","कठोर स्प्रिंग","A stiffer spring (k × 2) extends half as much.","कठोर स्प्रिंग (k × 2) आधा खिंचता है।",{click:["Stiffer spring (k ×2)","+100 g"]},12],
["Elastic energy","प्रत्यास्थ ऊर्जा","Work done = area under the F–x graph = ½kx². Compress and release.","कार्य = F–x आरेख का क्षेत्रफल = ½kx²; दबाकर छोड़िए।",{click:["Release spring","Compress +","▶ Go"]},13],
["Friction","घर्षण","With friction on, mechanical energy is lost as heat; without it energy is conserved.","घर्षण होने पर यांत्रिक ऊर्जा ऊष्मा बनती है; न होने पर संरक्षित।",{click:["Conservative vs friction","Friction ON/OFF","▶ Go"]},13]]);
/* ---------- Sound ---------- */
G("ix12/source",[
["Sound comes from vibration","ध्वनि कंपन से आती है","Anything that vibrates makes sound. Pluck the string.","जो भी कंपन करता है ध्वनि बनाता है; तार छेड़िए।",{click:["🎸 String"]},11],
["Pitch and length","तारत्व व लंबाई","A shorter string vibrates faster: higher pitch (frequency).","छोटा तार तेज़ कंपन करता है — ऊँचा तारत्व (आवृत्ति)।",{click:["Shorter (higher pitch)","Longer (lower pitch)"]},13],
["Loudness and amplitude","प्रबलता व आयाम","Pluck harder (larger amplitude): louder sound; pitch unchanged.","ज़ोर से छेड़ें (अधिक आयाम): प्रबल ध्वनि; तारत्व वही।",{click:["Louder","Softer"]},12],
["Drum membrane","ढोल की झिल्ली","A struck stretched membrane vibrates and sets the air in motion.","चोट खाई तनी झिल्ली कंपन कर हवा को हिलाती है।",{click:["🥁 Membrane"]},11],
["Air column","वायु स्तंभ","Blowing across a pipe makes the air column vibrate (flute, trumpet).","नली पर फूँकने से वायु स्तंभ कंपन करता है (बाँसुरी, तुरही)।",{click:["🎺 Air column"]},11]]);
G("ix12/wave",[
["A sound wave","ध्वनि तरंग","A vibrating source pushes particles: compressions (crowded) and rarefactions (spread). The wave is longitudinal.","कंपित स्रोत कणों को धकेलता है: संपीडन (घने) व विरलन (फैले); तरंग अनुदैर्ध्य है।",{click:["Air"]},11],
["Frequency and amplitude","आवृत्ति व आयाम","Higher frequency means more waves per second (higher pitch); larger amplitude means louder.","अधिक आवृत्ति = प्रति सेकंड अधिक तरंगें (ऊँचा तारत्व); अधिक आयाम = प्रबल।",{click:["Frequency +100 Hz","Amplitude +"]},12],
["Different media","भिन्न माध्यम","Sound is faster in solids than liquids and gases: air 343 m/s, water ≈1480, steel ≈5000.","ध्वनि ठोस में द्रव व गैस से तेज़: वायु 343 m/s, जल ≈1480, इस्पात ≈5000।",{click:["Water","Steel"]},13],
["No medium, no sound","माध्यम के बिना ध्वनि नहीं","In a vacuum there is nothing to compress: no sound.","निर्वात में संपीड़ित करने को कुछ नहीं — ध्वनि नहीं।",{click:["🕳 Vacuum (no medium)"]},11]]);
G("ix12/echo",[
["Reflection of sound","ध्वनि का परावर्तन","Sound reflects from a hard surface and returns as an echo after t = 2d/v.","ध्वनि कठोर सतह से लौटकर प्रतिध्वनि बनती है, t = 2d/v।",{click:["Echo","🔔 Make sound"]},12],
["Minimum distance","न्यूनतम दूरी","The ear keeps a sound for 0.1 s, so the reflector must be at least 17.2 m away.","कान ध्वनि को 0.1 s तक याद रखता है, इसलिए परावर्तक कम से कम 17.2 m दूर होना चाहिए।",{click:["Distance +5 m","Distance +5 m","🔔 Make sound"]},13],
["Reverberation","अनुरणन","In a big hall repeated reflections blur together: reverberation, reduced by curtains and carpets.","बड़े हॉल में बार-बार परावर्तन मिलकर अनुरणन बनाते हैं; पर्दे-कालीन इसे घटाते हैं।",{click:["Reverberation (hall)","🔔 Make sound"]},13],
["Echolocation","प्रतिध्वनि-स्थानन","Bats emit ultrasound and use the echo to find prey; sonar works the same way.","चमगादड़ पराश्रव्य ध्वनि भेजकर प्रतिध्वनि से शिकार खोजते हैं; सोनार भी यही।",{click:["Echolocation (bat)","🔔 Make sound"]},13]]);
/* ---------- Earth & environment ---------- */
G("ix8/spheres",[
["Earth as a system","पृथ्वी एक तंत्र","Atmosphere, hydrosphere, geosphere, biosphere and cryosphere interact. Switch each on in turn.","वायुमंडल, जलमंडल, स्थलमंडल, जैवमंडल व हिममंडल परस्पर क्रिया करते हैं; एक-एक चालू कीजिए।",{set:{"🌫 Atmosphere":false,"🌊 Hydrosphere":false,"🪨 Geosphere":true,"🌿 Biosphere":false,"❄ Cryosphere":false}},10],
["Atmosphere and hydrosphere","वायुमंडल व जलमंडल","Air (78 % N₂, 21 % O₂) and water (oceans, rivers, groundwater).","वायु (78 % N₂, 21 % O₂) और जल (सागर, नदियाँ, भूजल)।",{set:{"🌫 Atmosphere":true,"🌊 Hydrosphere":true,"🪨 Geosphere":false,"🌿 Biosphere":false,"❄ Cryosphere":false}},12],
["Biosphere and cryosphere","जैवमंडल व हिममंडल","Living things and polar ice, glaciers and snow.","जीव-जगत तथा ध्रुवीय बर्फ़, हिमनद व हिम।",{set:{"🌫 Atmosphere":false,"🌊 Hydrosphere":false,"🪨 Geosphere":false,"🌿 Biosphere":true,"❄ Cryosphere":true}},12],
["Interactions","अंतःक्रियाएँ","Everything is linked: melting ice (cryosphere) raises seas (hydrosphere) and changes weather (atmosphere).","सब जुड़ा है: बर्फ़ पिघलने (हिम) से सागर (जल) चढ़ता और मौसम (वायु) बदलता है।",{set:{"🌫 Atmosphere":true,"🌊 Hydrosphere":true,"🪨 Geosphere":true,"🌿 Biosphere":true,"❄ Cryosphere":true}},10]]);
G("ix8/heating",[
["Unequal heating of Earth","पृथ्वी का असमान ऊष्मन","Sunlight arrives as parallel rays but heats different places unequally: latitude, season and surface decide.","सूर्य की समांतर किरणें अलग स्थानों को असमान गरम करती हैं: अक्षांश, ऋतु व सतह।",{click:["Equinox"]},10],
["Latitude","अक्षांश","Near the equator rays fall straight and heat a small area; near the poles they slant over a large area — less heat per unit area.","विषुवत् पर किरणें सीधी व छोटा क्षेत्र गरम; ध्रुवों पर तिरछी व बड़े क्षेत्र में — प्रति इकाई ऊष्मा कम।",{click:["Lat +15°","Lat +15°"]},13],
["Seasons","ऋतुएँ","Earth's axis is tilted 23.5°: in June the north gets direct rays (summer); in December the south does.","पृथ्वी का अक्ष 23.5° झुका है: जून में उत्तर में सीधी किरणें (गर्मी); दिसंबर में दक्षिण में।",{click:["June (tilt +23.5°)","December (tilt −23.5°)"]},13],
["Albedo of surfaces","सतहों का एल्बीडो","Snow reflects most light (high albedo, stays cold); ocean and forest absorb it (low albedo).","बर्फ़ अधिक प्रकाश लौटाती है (उच्च एल्बीडो, ठंडी); सागर व वन सोखते हैं (निम्न एल्बीडो)।",{click:["Ocean","Forest","Desert sand","Snow / ice"]},14]]);
G("ix8/breeze",[
["Why does wind blow?","हवा क्यों चलती है?","Land heats and cools faster than water. Warm air rises and cool air rushes in to replace it: wind.","स्थल जल से जल्दी गरम व ठंडा होता है; गरम हवा ऊपर उठती और ठंडी हवा उसकी जगह भरती है — पवन।",{click:["☀ Day","🌊 Sea & land breeze"]},12],
["Sea breeze (day)","समुद्री समीर (दिन)","By day land is warmer: air rises over land and cooler air flows from the sea to the land.","दिन में स्थल गरम: स्थल पर हवा उठती और ठंडी हवा समुद्र से स्थल की ओर बहती है।",{click:["☀ Day"]},12],
["Land breeze (night)","स्थलीय समीर (रात)","By night land cools faster: the flow reverses, from land to sea.","रात में स्थल जल्दी ठंडा: प्रवाह उलटता है — स्थल से समुद्र की ओर।",{click:["🌙 Night"]},12],
["Mountain and valley","पर्वत व घाटी समीर","By day the slope warms and air flows up the valley; at night cold air drains down.","दिन में ढलान गरम और हवा घाटी से ऊपर; रात में ठंडी हवा नीचे उतरती है।",{click:["⛰ Mountain & valley breeze","☀ Day","🌙 Night"]},13]]);
G("ix8/cycles",[
["Cycles of matter","पदार्थ के चक्र","Water, carbon, nitrogen and oxygen circulate between living things and the environment.","जल, कार्बन, नाइट्रोजन व ऑक्सीजन जीवों व पर्यावरण के बीच घूमते रहते हैं।",{click:["Water cycle"]},9],
["Water cycle","जल चक्र","Evaporation → condensation → precipitation → runoff and groundwater.","वाष्पन → संघनन → वर्षण → अपवाह व भूजल।",{click:["Water cycle"]},12],
["Carbon cycle","कार्बन चक्र","Plants take CO₂ by photosynthesis; respiration and burning return it.","पौधे प्रकाश-संश्लेषण से CO₂ लेते हैं; श्वसन व दहन लौटाते हैं।",{click:["Carbon cycle"]},12],
["Nitrogen cycle","नाइट्रोजन चक्र","Bacteria fix N₂ into nitrates for plants; other bacteria return N₂ to air.","जीवाणु N₂ को पौधों के लिए नाइट्रेट बनाते हैं; अन्य उसे वायु में लौटाते हैं।",{click:["Nitrogen cycle"]},12],
["Oxygen cycle","ऑक्सीजन चक्र","Photosynthesis releases O₂; respiration and combustion use it.","प्रकाश-संश्लेषण O₂ देता है; श्वसन व दहन उपयोग करते हैं।",{click:["Oxygen cycle"]},11],
["Human impact","मानव प्रभाव","Burning fuel and deforestation upset the cycles (more CO₂, climate change).","ईंधन-दहन व वन-कटाई चक्र बिगाड़ते हैं (अधिक CO₂, जलवायु परिवर्तन)।",{click:["🏭 Human impact"]},12]]);
G("ix8/spectrum",[
["Sunlight is an EM wave","सूर्य-प्रकाश EM तरंग है","All EM waves travel at c = 3 × 10⁸ m/s; they differ in frequency and wavelength.","सभी EM तरंगें c = 3 × 10⁸ m/s से चलती हैं; आवृत्ति व तरंगदैर्ध्य भिन्न।",{click:["Reset","Visible"]},10],
["Radio to infrared","रेडियो से अवरक्त","Radio (long), microwave (cooking, radar), infrared (heat).","रेडियो (दीर्घ), माइक्रोवेव (भोजन, रडार), अवरक्त (ऊष्मा)।",{click:["Radio","Microwave","Infrared"]},13],
["Visible light","दृश्य प्रकाश","The narrow band our eyes detect: VIBGYOR, 400–700 nm.","संकरा बैंड जो आँख देखती है: VIBGYOR, 400–700 nm।",{click:["Visible"]},11],
["Ultraviolet, X-ray, gamma","पराबैंगनी, X-किरण, गामा","High-energy waves: UV (sunburn, vitamin D), X-rays (bones), gamma (radiotherapy).","उच्च ऊर्जा तरंगें: UV (धूप-झुलस, विटामिन D), X-किरण (हड्डी), गामा (रेडियोथेरेपी)।",{click:["Ultraviolet","X-ray","Gamma"]},13]]);
})();
