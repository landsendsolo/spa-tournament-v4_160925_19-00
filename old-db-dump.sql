PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'player',
    "playerId" TEXT,
    "testPlayerBId" TEXT,
    "testActivePlayer" TEXT,
    "testPlayerAId" TEXT,
    CONSTRAINT "User_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_testPlayerAId_fkey" FOREIGN KEY ("testPlayerAId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_testPlayerBId_fkey" FOREIGN KEY ("testPlayerBId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO User VALUES('cmeqebhws0000wsopy5mih3kc','Test User','testuserbiky4chp@example.com',NULL,NULL,'$2a$12$/cYn00wGkiaZ2yYW8KrhJe5TbyXXHgk8eI1UaD.9e4FCsrhCfgXLC','player',NULL,NULL,NULL,NULL);
INSERT INTO User VALUES('cmeqefd4f0000wssnzty91pxa','Test User','testuserw41yfhax@example.com',NULL,NULL,'$2a$12$E/9h2CRNUqh4wvdP1BrLs.4pnqmm3EeXn4qVEQaF6C/y9IphKhJ0O','player',NULL,NULL,NULL,NULL);
INSERT INTO User VALUES('cmeqep1br0000wsstyqh6xck9','Test User','testuserjew9v9sr@example.com',NULL,NULL,'$2a$12$p2JZ4SsmZa/9HZwWzeAgGu9OUNbuJ5rAquEK2mnFJbM1/jk3gtE0e','player',NULL,NULL,NULL,NULL);
INSERT INTO User VALUES('cmeqewo560000wsodqo139y41','Test User','testuserbva98tfq@example.com',NULL,NULL,'$2a$12$mTHqILOidHU2NZcj8JmK/uTkT6KzOFfix7ISA8jk.V5EyNY4P7vDu','player',NULL,NULL,NULL,NULL);
INSERT INTO User VALUES('cmeqf8hm50000wsw1345ayuw8','Test User','testuserwps0ptn6@example.com',NULL,NULL,'$2a$12$Z70tzTXyRXXlQUs5GRHHwOwp3bYeKyTr5S0yyvaNKJZKAORViqtTa','player',NULL,NULL,NULL,NULL);
INSERT INTO User VALUES('cmeqx5c3j0000stmzxe3yk8vy','Test User','testuser7bq2wxbe@example.com',NULL,NULL,'$2a$12$EuHWkzolFgY5TOpX02m9EuLizd1CVu9eCMy3uchTqL28h5Wxe/pAa','player',NULL,NULL,NULL,NULL);
INSERT INTO User VALUES('cmepzghxc0002vodzm4wsi2mm','Area Rep','arearep@spa.com',NULL,NULL,'$2a$10$56esLRnLd/MO9V5UFYgETuGJPD8Q4K3FVSOK9MV3rs4DoWYNfrssS','area_rep',NULL,NULL,NULL,NULL);
INSERT INTO User VALUES('cmesmtily0003wtx9xkhvc5t3','John Doe','john@doe.com',NULL,NULL,'$2a$12$i9drDfIK2EZ.0wlYrYhEOearvJgmftA2K3KxDMqbwJ0ttzewVN24G','player',NULL,NULL,NULL,NULL);
INSERT INTO User VALUES('cmet1gg4g0001jx9xjr6uo23c','Steven Couper','stevecouper1991@gmail.com',NULL,NULL,'$2a$12$uPbn3JUih86hDKNeTCqyoemHoGPrWnG4xgb4HVP9relRqdFnpbyNS','player','cmeoo95v5000gssr3k7q8cc8t',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet1i6480009jx9xi1spqesq','Ross Hutchison','rosshutch88@hotmail.com',NULL,NULL,'$2a$12$SFVhcCWCaooQg5depDbTeOJ3ueBxOIxzg9xG3axA0lRQ5geW4VVZS','player','cmeoobi7b0003ssu9av8d6jlv',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet1nr8y000djx9xcoopg0p3','Ross Turley','rossturley89@gmail.com',NULL,NULL,'$2a$12$uI2ibjrK8BQHq5ZiWxlAd./J40ode1COpODDN3otf.ZfOIt6vRbnC','player','cmeoobi740001ssu9cn1ll1mw',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet201vl000hjx9xvnld1sw0','Scott Johnston ','mobile_07769804891@spa.tournament',NULL,NULL,'$2a$12$DL.LQAEDWpVBEl/y/arFFufSWwU3GvyUOP21RtBEWloJFHG.Qz7Ei','player','cmeoo95vd000jssr3tm2ewahw',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet23490000ljx9xw04va68o','Neil Cochrane','cocky2747@googlemail.com',NULL,NULL,'$2a$12$02kasvz1us7s1Dz.RSL.Huuzsfyf6mS2..lybI9T0Zu/ZVeVWUwfa','player','cmeoo95tz0002ssr37zy02uhs',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet27cbx0029jx9xfqpm6kpm','GAVIN HUNTER','gavin.hun1982.gh@gmail.com',NULL,NULL,'$2a$12$eJKbOujGYZPpDP3bQY5YfOrdmolSrCV/te0CgcQlLGrdT1Gk/s/ua','player','cmeoo95uz000essr30m355m69',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet2gl6n002jjx9xm87h096v','Andrew Moffat','andymo147@sky.com',NULL,NULL,'$2a$12$6XIBNJ0/EEYnRYM1BDHss.F.H0CdmoEntCP4GFMSen74.I2UU9.wS','player','cmeoo95tv0001ssr39x0gj0y3',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet2ne87002njx9xlptqizxh','Steven Stores','stevenstores2671@gmail.com',NULL,NULL,'$2a$12$p80IFptLBlSi2LR/gG1VIOoYRb0fJSYvyUKafUHBbSXb9m3T3kVDa','player','cmeoo95ue0007ssr37k07omem',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet2nzo6002rjx9xltol19uk','Callum Brown','callumbrown123@hotmail.co.uk',NULL,NULL,'$2a$12$jv7WBUw2jb2IkJEgakWnKOlZJUxA4GQi2JayFwVAxOTel610.ztQy','player','cmeoo95uc0006ssr3i7b75wnv',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet3788j002vjx9xy8r5hkku','Jayde devlin','mobile_07901730898@spa.tournament',NULL,NULL,'$2a$12$aU0aMI4HKxjL22qCc8LTr.WewTeWSFcmoKCJMLvX.NfeeLMKrqIfW','player','cmeoobi7f0004ssu9xqv86bpx',NULL,NULL,NULL);
INSERT INTO User VALUES('cmet3c489002zjx9xk4645xi6','Steven Griggs','mobile_07706143829@spa.tournament',NULL,NULL,'$2a$12$GrpN0JRMkDDxu1NTL2pab.VPCrBoq1EhRJfDnS/W0iCSYUQsM/Lj6','player','cmeoo95tq0000ssr3q4vymayv',NULL,NULL,NULL);
INSERT INTO User VALUES('cmettoi750001jxjarrf3389c','Steven Kirkpatrick ','steve.147@hotmail.co.uk',NULL,NULL,'$2a$12$qKISlCi5prONOlvxhX1X1.xJA/IEDpVQ2c9l6fJHzRR14w7TtUVSC','player','cmeoo95uk0009ssr3gmh7ssfd',NULL,NULL,NULL);
INSERT INTO User VALUES('cmeudib950001jxrrhlro54t4','Paul Hamilton','pawlhamilton@gmail.com',NULL,NULL,'$2a$12$2fhzitx3jMDgK/fviaa6x.RImMGEdKtdAUaZW.5tdMRZZrnxZsvKG','player','cmeoo95uh0008ssr3vxpokr04',NULL,NULL,NULL);
INSERT INTO User VALUES('cmevfvhec0001jxiixuo1qsrm','Owen Bruce','mobile_07379926426@spa.tournament',NULL,NULL,'$2a$12$KhifmPs3E9Zz5J6TQ41Vbe366LUvNel9BHv3y03StwEJW8HtUAjR2','player','cmeoobi6z0000ssu9680pp27k',NULL,NULL,NULL);
INSERT INTO User VALUES('cmevgefh80005jxiiz8epuq68','Andy lammie','mobile_07920115853@spa.tournament',NULL,NULL,'$2a$12$y88UHYPj5GvSHYpjDa4saujwnyR1OIhJMbKTHPhsESY/w8yXZ6qqu','player','cmeoo95u60004ssr3qw218mpk',NULL,NULL,NULL);
INSERT INTO User VALUES('cmevrgjru0001jxe8qmcol7zs','Jonathan Robertson','jonathan-robertson@hotmail.co.uk',NULL,NULL,'$2a$12$rq9zmdkBHhE12LZg3/1BjOJRAqGQ8LKCt4PWW3BVmPu.WxOv31qT.','player','cmeoo95v2000fssr31f0rn4vc',NULL,NULL,NULL);
CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'player',
    "acceptedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Player VALUES('cmeoo95uz000essr30m355m69','Gavin Hunter','+447494795635',NULL,'player',NULL,1755978489323,1756062163278);
INSERT INTO Player VALUES('cmeoo95uk0009ssr3gmh7ssfd','Steven Kirkpatrick','+447729513787',NULL,'player',NULL,1755978489309,1756062163287);
INSERT INTO Player VALUES('cmeoo95ut000cssr34dbu97qt','Daniel Wylie','+447787426226',NULL,'player',NULL,1755978489317,1756062163289);
INSERT INTO Player VALUES('cmeoo95uq000bssr3ygebraul','Paul Harkness','+447955904412',NULL,'player',NULL,1755978489314,1756062163290);
INSERT INTO Player VALUES('cmeoobi740001ssu9cn1ll1mw','Ross Turley','+447827933305',NULL,'player',NULL,1755978598624,1756062163292);
INSERT INTO Player VALUES('cmeoobi770002ssu9n03rdi70','Tam Corsan','+447810663947',NULL,'player',NULL,1755978598628,1756062163294);
INSERT INTO Player VALUES('cmeoobi6z0000ssu9680pp27k','Owen Bruce','+447379926426',NULL,'player',NULL,1755978598619,1756062163295);
INSERT INTO Player VALUES('cmeoobi7j0005ssu9bcib9xkf','Kevin Galligan','+447530560632',NULL,'player',NULL,1755978598639,1756062163297);
INSERT INTO Player VALUES('cmeoo95ue0007ssr37k07omem','Stevie Stores','+447920855624',NULL,'player',NULL,1755978489303,1756062163299);
INSERT INTO Player VALUES('cmeoo95un000assr33ic1fjb9','Dan Thom','+447734859989',NULL,'player',NULL,1755978489312,1756062163300);
INSERT INTO Player VALUES('cmeoobi7f0004ssu9xqv86bpx','Jayde Devlin','+447901730898',NULL,'player',NULL,1755978598636,1756062163302);
INSERT INTO Player VALUES('cmeoo95v5000gssr3k7q8cc8t','Steven Couper','+447950576369',NULL,'player',NULL,1755978489329,1756062163303);
INSERT INTO Player VALUES('cmeoo95u60004ssr3qw218mpk','Andy Lammie','+447920115853',NULL,'player',NULL,1755978489294,1756062163304);
INSERT INTO Player VALUES('cmeoo95u20003ssr3j0v78l2e','Sandy Drysdale','+447971486652',NULL,'player',NULL,1755978489291,1756062163306);
INSERT INTO Player VALUES('cmeoo95vd000jssr3tm2ewahw','Scott Johnston','+447769804891',NULL,'player',NULL,1755978489338,1756062163307);
INSERT INTO Player VALUES('cmeoo95u90005ssr3stdg8bn5','Graham Campbell','+447780912377',NULL,'player',NULL,1755978489297,1756235388908);
INSERT INTO Player VALUES('cmeoo95tv0001ssr39x0gj0y3','Andy Moffat','+447376135923',NULL,'player',NULL,1755978489284,1756062163310);
INSERT INTO Player VALUES('cmeoo95v8000hssr3ef3wsgk4','Nathan Maloney','+447841570461',NULL,'player',NULL,1755978489332,1756062163312);
INSERT INTO Player VALUES('cmeoo95vb000issr3b8pj9d62','Mark Lockhart','+447479868816',NULL,'player',NULL,1755978489335,1756062163313);
INSERT INTO Player VALUES('cmeoobi7b0003ssu9av8d6jlv','Ross Hutchison','+447808118980',NULL,'player',NULL,1755978598632,1756062163314);
INSERT INTO Player VALUES('cmeoo95uh0008ssr3vxpokr04','Paul Hamilton','+447530282287',NULL,'player',NULL,1755978489306,1756062163315);
INSERT INTO Player VALUES('cmeoo95tz0002ssr37zy02uhs','Neil Cochrane','+447386389217',NULL,'player',NULL,1755978489287,1756062163317);
INSERT INTO Player VALUES('cmeoo95uc0006ssr3i7b75wnv','Callum Brown','+447909957995',NULL,'player',NULL,1755978489300,1756062163318);
INSERT INTO Player VALUES('cmeoo95uw000dssr3hth1bxry','Sean Trainor','+447874761436',NULL,'player',NULL,1755978489320,1756062163320);
INSERT INTO Player VALUES('cmeoo95v2000fssr31f0rn4vc','Jonny Robertson','+447749403710',NULL,'player',NULL,1755978489326,1756062163321);
INSERT INTO Player VALUES('cmeoo95tq0000ssr3q4vymayv','Steven Griggs','+447706143829',NULL,'player',NULL,1755978489278,1756062163322);
INSERT INTO Player VALUES('winner-r1-1','Winner(R1-1)','+44TEMP0001',NULL,'player',NULL,1756063972299,1756063972299);
INSERT INTO Player VALUES('winner-r1-2','Winner(R1-2)','+44TEMP0002',NULL,'player',NULL,1756063972367,1756063972367);
INSERT INTO Player VALUES('winner-r1-3','Winner(R1-3)','+44TEMP0003',NULL,'player',NULL,1756063972369,1756063972369);
INSERT INTO Player VALUES('winner-r1-4','Winner(R1-4)','+44TEMP0004',NULL,'player',NULL,1756063972371,1756063972371);
INSERT INTO Player VALUES('winner-r1-5','Winner(R1-5)','+44TEMP0005',NULL,'player',NULL,1756063972372,1756063972372);
INSERT INTO Player VALUES('winner-r1-6','Winner(R1-6)','+44TEMP0006',NULL,'player',NULL,1756063972374,1756063972374);
INSERT INTO Player VALUES('winner-r1-7','Winner(R1-7)','+44TEMP0007',NULL,'player',NULL,1756063972376,1756063972376);
INSERT INTO Player VALUES('winner-r1-8','Winner(R1-8)','+44TEMP0008',NULL,'player',NULL,1756063972377,1756063972377);
INSERT INTO Player VALUES('winner-r1-9','Winner(R1-9)','+44TEMP0009',NULL,'player',NULL,1756063972379,1756063972379);
INSERT INTO Player VALUES('winner-r1-10','Winner(R1-10)','+44TEMP0010',NULL,'player',NULL,1756063972381,1756063972381);
INSERT INTO Player VALUES('winner-r2-1','Winner(R2-1)','+44TEMP1001',NULL,'player',NULL,1756064443770,1756064443770);
INSERT INTO Player VALUES('winner-r2-2','Winner(R2-2)','+44TEMP1002',NULL,'player',NULL,1756064443837,1756064443837);
INSERT INTO Player VALUES('winner-r2-3','Winner(R2-3)','+44TEMP1003',NULL,'player',NULL,1756064443839,1756064443839);
INSERT INTO Player VALUES('winner-r2-4','Winner(R2-4)','+44TEMP1004',NULL,'player',NULL,1756064443840,1756064443840);
INSERT INTO Player VALUES('winner-r2-5','Winner(R2-5)','+44TEMP1005',NULL,'player',NULL,1756064443842,1756064443842);
INSERT INTO Player VALUES('winner-r2-6','Winner(R2-6)','+44TEMP1006',NULL,'player',NULL,1756064443844,1756064443844);
INSERT INTO Player VALUES('winner-r2-7','Winner(R2-7)','+44TEMP1007',NULL,'player',NULL,1756064443845,1756064443845);
INSERT INTO Player VALUES('winner-r2-8','Winner(R2-8)','+44TEMP1008',NULL,'player',NULL,1756064443847,1756064443847);
CREATE TABLE IF NOT EXISTS "Fixture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "route" TEXT NOT NULL,
    "round" TEXT NOT NULL,
    "playerAId" TEXT NOT NULL,
    "playerBId" TEXT NOT NULL,
    "homePlayerId" TEXT NOT NULL,
    "venue" TEXT,
    "scheduledAt" DATETIME,
    "deadlineDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "winnerId" TEXT,
    "scoreA" INTEGER,
    "scoreB" INTEGER,
    "firstContactMarkedAt" DATETIME,
    "firstContactBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Fixture_firstContactBy_fkey" FOREIGN KEY ("firstContactBy") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Fixture_homePlayerId_fkey" FOREIGN KEY ("homePlayerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fixture_playerAId_fkey" FOREIGN KEY ("playerAId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fixture_playerBId_fkey" FOREIGN KEY ("playerBId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Fixture_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO Fixture VALUES('cmeoo95vo000nssr3c0qyolo5','R1-2','R1','cmeoo95tz0002ssr37zy02uhs','cmeoo95u20003ssr3j0v78l2e','cmeoo95tz0002ssr37zy02uhs','Normandy',1756330020000,NULL,'completed','cmeoo95tz0002ssr37zy02uhs',7,4,1756243681852,'cmeoo95tz0002ssr37zy02uhs',1755978489349,1756243731057);
INSERT INTO Fixture VALUES('cmeoo95vt000pssr331buio1q','R1-3','R1','cmeoo95u60004ssr3qw218mpk','cmeoo95u90005ssr3stdg8bn5','cmeoo95u60004ssr3qw218mpk',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1755978489353,1755978489353);
INSERT INTO Fixture VALUES('cmeoo95vx000rssr34eyj24us','R1-4','R1','cmeoo95uc0006ssr3i7b75wnv','cmeoo95ue0007ssr37k07omem','cmeoo95uc0006ssr3i7b75wnv','Ballers',1756551600000,NULL,'date_confirmed',NULL,NULL,NULL,1756325453965,'cmeoo95uc0006ssr3i7b75wnv',1755978489357,1756325453966);
INSERT INTO Fixture VALUES('cmeoo95w1000sssr38wh0pgjr','R1-5','R1','cmeoo95uh0008ssr3vxpokr04','cmeoo95uk0009ssr3gmh7ssfd','cmeoo95uh0008ssr3vxpokr04','Ballers',1756488600000,NULL,'in_play',NULL,NULL,NULL,1756323353372,'cmeoo95uh0008ssr3vxpokr04',1755978489360,1756415931401);
INSERT INTO Fixture VALUES('cmeoo95w4000tssr30y97kf98','R1-6','R1','cmeoo95un000assr33ic1fjb9','cmeoo95uq000bssr3ygebraul','cmeoo95un000assr33ic1fjb9',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1755978489364,1755978489364);
INSERT INTO Fixture VALUES('cmeoo95w7000ussr356q6n53w','R1-7','R1','cmeoo95ut000cssr34dbu97qt','cmeoo95uw000dssr3hth1bxry','cmeoo95ut000cssr34dbu97qt',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1755978489367,1755978489367);
INSERT INTO Fixture VALUES('cmeoo95wb000vssr3yxonkrch','R1-8','R1','cmeoo95uz000essr30m355m69','cmeoo95v2000fssr31f0rn4vc','cmeoo95uz000essr30m355m69','Abbey Inn',1756416780000,NULL,'in_play',NULL,NULL,NULL,1756244035686,'cmeoo95uz000essr30m355m69',1755978489371,1756407157263);
INSERT INTO Fixture VALUES('cmeoo95we000wssr3aehnyj85','R1-9','R1','cmeoo95v5000gssr3k7q8cc8t','cmeoo95v8000hssr3ef3wsgk4','cmeoo95v5000gssr3k7q8cc8t','Ballers',1756501680000,NULL,'date_confirmed',NULL,NULL,NULL,1756242579997,'cmeoo95v5000gssr3k7q8cc8t',1755978489374,1756242579998);
INSERT INTO Fixture VALUES('cmeoo95wh000xssr3iamgmpkl','R1-10','R1','cmeoo95vb000issr3b8pj9d62','cmeoo95vd000jssr3tm2ewahw','cmeoo95vb000issr3b8pj9d62',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1755978489378,1755978489378);
INSERT INTO Fixture VALUES('cmeoo95vl000mssr3l52k1n0q','R1-1','R1','cmeoo95tq0000ssr3q4vymayv','cmeoo95tv0001ssr39x0gj0y3','cmeoo95tq0000ssr3q4vymayv','Abbey Inn',1756317600000,NULL,'completed','cmeoo95tv0001ssr39x0gj0y3',1,7,1756245743786,'cmeoo95tq0000ssr3q4vymayv',1755978489345,1756245766151);
INSERT INTO Fixture VALUES('cmerdfmne0000w5ej2zxfwqmh','R2-1','R2','cmeoobi6z0000ssu9680pp27k','cmeoo95tv0001ssr39x0gj0y3','cmeoobi6z0000ssu9680pp27k',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756063972306,1756245766156);
INSERT INTO Fixture VALUES('cmerdfmng0001w5ej4e5o7v4h','R2-2','R2','cmeoobi740001ssu9cn1ll1mw','cmeoo95tz0002ssr37zy02uhs','cmeoobi740001ssu9cn1ll1mw',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756063972368,1756243731063);
INSERT INTO Fixture VALUES('cmerdfmnh0002w5ej6l70m9qi','R2-3','R2','cmeoobi770002ssu9n03rdi70','winner-r1-3','cmeoobi770002ssu9n03rdi70',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756063972370,1756063972370);
INSERT INTO Fixture VALUES('cmerdfmni0003w5ejkhdxgc2l','R2-4','R2','cmeoobi7b0003ssu9av8d6jlv','winner-r1-4','cmeoobi7b0003ssu9av8d6jlv',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756063972372,1756063972372);
INSERT INTO Fixture VALUES('cmerdfmnj0004w5ej7s2b4b3k','R2-5','R2','winner-r1-5','winner-r1-6','winner-r1-5',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756063972374,1756063972374);
INSERT INTO Fixture VALUES('cmerdfmnk0005w5ej5i7vr8ky','R2-6','R2','cmeoobi7f0004ssu9xqv86bpx','winner-r1-7','cmeoobi7f0004ssu9xqv86bpx',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756063972376,1756063972376);
INSERT INTO Fixture VALUES('cmerdfmnl0006w5ejy3c6hul7','R2-7','R2','winner-r1-8','winner-r1-9','winner-r1-8',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756063972378,1756063972378);
INSERT INTO Fixture VALUES('cmerdfmnm0007w5ejcgqm4j6z','R2-8','R2','cmeoobi7j0005ssu9bcib9xkf','winner-r1-10','cmeoobi7j0005ssu9bcib9xkf',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756063972380,1756063972380);
INSERT INTO Fixture VALUES('cmerdhnzr0000w5exwzqlzgvz','R3-1','R3','winner-r2-1','winner-r2-2','winner-r2-1',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756064443778,1756064443778);
INSERT INTO Fixture VALUES('cmerdhnzs0001w5exlvj2gx3h','R3-2','R3','winner-r2-3','winner-r2-4','winner-r2-3',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756064443840,1756064443840);
INSERT INTO Fixture VALUES('cmerdhnzu0002w5exbvjb8vxc','R3-3','R3','winner-r2-5','winner-r2-6','winner-r2-5',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756064443843,1756064443843);
INSERT INTO Fixture VALUES('cmerdhnzv0003w5exhgxk12q9','R3-4','R3','winner-r2-7','winner-r2-8','winner-r2-7',NULL,NULL,NULL,'pending',NULL,NULL,NULL,NULL,NULL,1756064443846,1756064443846);
CREATE TABLE IF NOT EXISTS "Frame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fixtureId" TEXT NOT NULL,
    "frameNumber" INTEGER NOT NULL,
    "winnerPlayerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Frame_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Frame_winnerPlayerId_fkey" FOREIGN KEY ("winnerPlayerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "publicHubEnabled" BOOLEAN NOT NULL DEFAULT true,
    "liveScoringEnabled" BOOLEAN NOT NULL DEFAULT false,
    "brandingPlaceholders" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Setting VALUES('singleton',1,1,'{"title":"2025 SPA Ross McInnes Scottish Singles Championships","subtitle":"Championship Area Draw and Tournament Management","primaryColor":"#1e3a8a","secondaryColor":"#3b82f6"}',1756057773201,1756057786273);
CREATE TABLE IF NOT EXISTS "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'public',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "payloadJson" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO AuditLog VALUES('cmet1gg4k0003jx9x0n9dzft8','cmet1gg4g0001jx9xjr6uo23c','USER_SIGNUP','User','cmet1gg4g0001jx9xjr6uo23c','{"email":"stevecouper1991@gmail.com","mobile":"07950576369","inputMobile":"07950 576369","playerName":"Steven Couper","playerId":"cmeoo95v5000gssr3k7q8cc8t","playerRole":"player","userRole":"player"}',1756242528933);
INSERT INTO AuditLog VALUES('cmet1hjjl0007jx9x7m49qos9','cmet1gg4g0001jx9xjr6uo23c','CONFIRM_TIE','FIXTURE','cmeoo95we000wssr3aehnyj85','{"fixtureId":"cmeoo95we000wssr3aehnyj85","playerName":"Steven Couper","venue":"Ballers","scheduledAt":"2025-08-29T21:08:00.000Z","timestamp":"2025-08-26T21:09:40.016Z"}',1756242580017);
INSERT INTO AuditLog VALUES('cmet1i64c000bjx9xw567vjod','cmet1i6480009jx9xi1spqesq','USER_SIGNUP','User','cmet1i6480009jx9xi1spqesq','{"email":"rosshutch88@hotmail.com","mobile":"07808118980","inputMobile":"07808 118980","playerName":"Ross Hutchison","playerId":"cmeoobi7b0003ssu9av8d6jlv","playerRole":"player","userRole":"player"}',1756242609276);
INSERT INTO AuditLog VALUES('cmet1nr92000fjx9xazqg9wob','cmet1nr8y000djx9xcoopg0p3','USER_SIGNUP','User','cmet1nr8y000djx9xcoopg0p3','{"email":"rossturley89@gmail.com","mobile":"07827933305","inputMobile":"07827 933305","playerName":"Ross Turley","playerId":"cmeoobi740001ssu9cn1ll1mw","playerRole":"player","userRole":"player"}',1756242869942);
INSERT INTO AuditLog VALUES('cmet201vo000jjx9xqpom0cmx','cmet201vl000hjx9xvnld1sw0','USER_SIGNUP','User','cmet201vl000hjx9xvnld1sw0','{"email":"mobile_07769804891@spa.tournament","mobile":"07769804891","inputMobile":"07769 804891","playerName":"Scott Johnston","playerId":"cmeoo95vd000jssr3tm2ewahw","playerRole":"player","userRole":"player"}',1756243443589);
INSERT INTO AuditLog VALUES('cmet23493000njx9xg8h40oi5','cmet23490000ljx9xw04va68o','USER_SIGNUP','User','cmet23490000ljx9xw04va68o','{"email":"cocky2747@googlemail.com","mobile":"07386389217","inputMobile":"07386 389217","playerName":"Neil Cochrane","playerId":"cmeoo95tz0002ssr37zy02uhs","playerRole":"player","userRole":"player"}',1756243586632);
INSERT INTO AuditLog VALUES('cmet255qd000rjx9xsie3g2tk','cmet23490000ljx9xw04va68o','CONFIRM_TIE','FIXTURE','cmeoo95vo000nssr3c0qyolo5','{"fixtureId":"cmeoo95vo000nssr3c0qyolo5","playerName":"Neil Cochrane","venue":"Normandy","scheduledAt":"2025-08-27T21:27:00.000Z","timestamp":"2025-08-26T21:28:01.860Z"}',1756243681861);
INSERT INTO AuditLog VALUES('cmet27cc0002bjx9xzd6htfic','cmet27cbx0029jx9xfqpm6kpm','USER_SIGNUP','User','cmet27cbx0029jx9xfqpm6kpm','{"email":"gavin.hun1982.gh@gmail.com","mobile":"07494795635","inputMobile":"07494 795635","playerName":"Gavin Hunter","playerId":"cmeoo95uz000essr30m355m69","playerRole":"player","userRole":"player"}',1756243783728);
INSERT INTO AuditLog VALUES('cmet2c501002djx9xt6g3dvgo','cmet27cbx0029jx9xfqpm6kpm','SET_VENUE','FIXTURE','cmeoo95wb000vssr3yxonkrch','{"fixtureId":"cmeoo95wb000vssr3yxonkrch","venue":"Abbey Inn","playerName":"GAVIN HUNTER","timestamp":"2025-08-26T21:33:27.504Z","statusChanged":null}',1756244007505);
INSERT INTO AuditLog VALUES('cmet2cqr3002hjx9xk5ylpup3','cmet27cbx0029jx9xfqpm6kpm','CONFIRM_TIE','FIXTURE','cmeoo95wb000vssr3yxonkrch','{"fixtureId":"cmeoo95wb000vssr3yxonkrch","playerName":"GAVIN HUNTER","venue":"Abbey Inn","scheduledAt":"2025-08-28T21:33:00.000Z","timestamp":"2025-08-26T21:33:55.694Z"}',1756244035695);
INSERT INTO AuditLog VALUES('cmet2gl6r002ljx9x0rvbhokf','cmet2gl6n002jjx9xm87h096v','USER_SIGNUP','User','cmet2gl6n002jjx9xm87h096v','{"email":"andymo147@sky.com","mobile":"07376135923","inputMobile":"07376 135923","playerName":"Andy Moffat","playerId":"cmeoo95tv0001ssr39x0gj0y3","playerRole":"player","userRole":"player"}',1756244215107);
INSERT INTO AuditLog VALUES('cmet2ne8b002pjx9xxd1egnvx','cmet2ne87002njx9xlptqizxh','USER_SIGNUP','User','cmet2ne87002njx9xlptqizxh','{"email":"stevenstores2671@gmail.com","mobile":"07920855624","inputMobile":"07920 855624","playerName":"Stevie Stores","playerId":"cmeoo95ue0007ssr37k07omem","playerRole":"player","userRole":"player"}',1756244532684);
INSERT INTO AuditLog VALUES('cmet2nzo9002tjx9xtyamzdxa','cmet2nzo6002rjx9xltol19uk','USER_SIGNUP','User','cmet2nzo6002rjx9xltol19uk','{"email":"callumbrown123@hotmail.co.uk","mobile":"07909957995","inputMobile":"07909 957995","playerName":"Callum Brown","playerId":"cmeoo95uc0006ssr3i7b75wnv","playerRole":"player","userRole":"player"}',1756244560473);
INSERT INTO AuditLog VALUES('cmet3788n002xjx9xdg5a8894','cmet3788j002vjx9xy8r5hkku','USER_SIGNUP','User','cmet3788j002vjx9xy8r5hkku','{"email":"mobile_07901730898@spa.tournament","mobile":"07901730898","inputMobile":"07901 730898","playerName":"Jayde Devlin","playerId":"cmeoobi7f0004ssu9xqv86bpx","playerRole":"player","userRole":"player"}',1756245458039);
INSERT INTO AuditLog VALUES('cmet3c48d0031jx9x1v0a18ta','cmet3c489002zjx9xk4645xi6','USER_SIGNUP','User','cmet3c489002zjx9xk4645xi6','{"email":"mobile_07706143829@spa.tournament","mobile":"07706143829","inputMobile":"07706 143829","playerName":"Steven Griggs","playerId":"cmeoo95tq0000ssr3q4vymayv","playerRole":"player","userRole":"player"}',1756245686125);
INSERT INTO AuditLog VALUES('cmet3dcq90035jx9xm8u8ezs0','cmet3c489002zjx9xk4645xi6','CONFIRM_TIE','FIXTURE','cmeoo95vl000mssr3l52k1n0q','{"fixtureId":"cmeoo95vl000mssr3l52k1n0q","playerName":"Steven Griggs","venue":"Abbey Inn","scheduledAt":"2025-08-27T18:00:00.000Z","timestamp":"2025-08-26T22:02:23.793Z"}',1756245743794);
INSERT INTO AuditLog VALUES('cmet3jo83004djx9xiq5w44d5','cmet2nzo6002rjx9xltol19uk','MESSAGE_SENT','Message','cmet3jo7z004bjx9xr2ighfo9','{"fixtureId":"cmeoo95vx000rssr34eyj24us","messageType":"text","contentPreview":"Alrite Stevie"}',1756246038627);
INSERT INTO AuditLog VALUES('cmet3kkfu004hjx9xrycqn7b4','cmet2nzo6002rjx9xltol19uk','MESSAGE_SENT','Message','cmet3kkfr004fjx9xhshdfl1f','{"fixtureId":"cmeoo95vx000rssr34eyj24us","messageType":"text","contentPreview":"You up for playing this tie on Friday 19:30 at ballers"}',1756246080379);
INSERT INTO AuditLog VALUES('cmettoi790003jxjaf2189ofd','cmettoi750001jxjarrf3389c','USER_SIGNUP','User','cmettoi750001jxjarrf3389c','{"email":"steve.147@hotmail.co.uk","mobile":"07729513787","inputMobile":"07729 513787","playerName":"Steven Kirkpatrick","playerId":"cmeoo95uk0009ssr3gmh7ssfd","playerRole":"player","userRole":"player"}',1756289934118);
INSERT INTO AuditLog VALUES('cmetu1yzn0007jxjati1bjgri','cmet2ne87002njx9xlptqizxh','MESSAGE_SENT','Message','cmetu1yzj0005jxjaw650fvmt','{"fixtureId":"cmeoo95vx000rssr34eyj24us","messageType":"text","contentPreview":"Hi pal. Got something on Friday pal i can do Saturday or Sunday afternoon."}',1756290562404);
INSERT INTO AuditLog VALUES('cmeub9ino0003jxaqo36xxycn','cmet2nzo6002rjx9xltol19uk','MESSAGE_SENT','Message','cmeub9ink0001jxaqkkioflle','{"fixtureId":"cmeoo95vx000rssr34eyj24us","messageType":"text","contentPreview":"Could do Saturday, what time you thinking?"}',1756319467956);
INSERT INTO AuditLog VALUES('cmeudf8b00003jxdnkezg8fxx','cmet2ne87002njx9xlptqizxh','MESSAGE_SENT','Message','cmeudf8aw0001jxdnt4b6svyw','{"fixtureId":"cmeoo95vx000rssr34eyj24us","messageType":"text","contentPreview":"12 o''clock or 1 o''clock if that suits you"}',1756323093709);
INSERT INTO AuditLog VALUES('cmeudib980003jxrrtxem5mo4','cmeudib950001jxrrhlro54t4','USER_SIGNUP','User','cmeudib950001jxrrhlro54t4','{"email":"pawlhamilton@gmail.com","mobile":"07530282287","inputMobile":"07530 282287","playerName":"Paul Hamilton","playerId":"cmeoo95uh0008ssr3vxpokr04","playerRole":"player","userRole":"player"}',1756323237501);
INSERT INTO AuditLog VALUES('cmeudivd20005jxrr81c83xwy','cmeudib950001jxrrhlro54t4','SET_VENUE','FIXTURE','cmeoo95w1000sssr38wh0pgjr','{"fixtureId":"cmeoo95w1000sssr38wh0pgjr","venue":"Ballers","playerName":"Paul Hamilton","timestamp":"2025-08-27T19:34:23.557Z","statusChanged":null}',1756323263559);
INSERT INTO AuditLog VALUES('cmeudksoa0009jxrrisd1zmg4','cmeudib950001jxrrhlro54t4','CONFIRM_TIE','FIXTURE','cmeoo95w1000sssr38wh0pgjr','{"fixtureId":"cmeoo95w1000sssr38wh0pgjr","playerName":"Paul Hamilton","venue":"Ballers","scheduledAt":"2025-08-29T17:30:00.000Z","timestamp":"2025-08-27T19:35:53.386Z"}',1756323353387);
INSERT INTO AuditLog VALUES('cmeuesen80003jxcnoofbhx3f','cmet2nzo6002rjx9xltol19uk','MESSAGE_SENT','Message','cmeuesen40001jxcnfblfkeb0','{"fixtureId":"cmeoo95vx000rssr34eyj24us","messageType":"text","contentPreview":"Go for 12 mate, see you at ballers then 👍🏼"}',1756325388069);
INSERT INTO AuditLog VALUES('cmeuesn160005jxcncgij87y1','cmet2nzo6002rjx9xltol19uk','SET_VENUE','FIXTURE','cmeoo95vx000rssr34eyj24us','{"fixtureId":"cmeoo95vx000rssr34eyj24us","venue":"Ballers","playerName":"Callum Brown","timestamp":"2025-08-27T20:09:58.937Z","statusChanged":null}',1756325398938);
INSERT INTO AuditLog VALUES('cmeuetti40009jxcnzsnsiray','cmet2nzo6002rjx9xltol19uk','CONFIRM_TIE','FIXTURE','cmeoo95vx000rssr34eyj24us','{"fixtureId":"cmeoo95vx000rssr34eyj24us","playerName":"Callum Brown","venue":"Ballers","scheduledAt":"2025-08-30T11:00:00.000Z","timestamp":"2025-08-27T20:10:53.980Z"}',1756325453981);
INSERT INTO AuditLog VALUES('cmeuevg78000djxcnqcp5nhox','cmet2ne87002njx9xlptqizxh','MESSAGE_SENT','Message','cmeuevg75000bjxcnyjy3euwi','{"fixtureId":"cmeoo95vx000rssr34eyj24us","messageType":"text","contentPreview":"See you then pal."}',1756325530053);
INSERT INTO AuditLog VALUES('cmevfvhei0003jxii7ejhmw5m','cmevfvhec0001jxiixuo1qsrm','USER_SIGNUP','User','cmevfvhec0001jxiixuo1qsrm','{"email":"mobile_07379926426@spa.tournament","mobile":"07379926426","inputMobile":"07379 926426","playerName":"Owen Bruce","playerId":"cmeoobi6z0000ssu9680pp27k","playerRole":"player","userRole":"player"}',1756387677403);
INSERT INTO AuditLog VALUES('cmevgefhc0007jxii2s55nqeg','cmevgefh80005jxiiz8epuq68','USER_SIGNUP','User','cmevgefh80005jxiiz8epuq68','{"email":"mobile_07920115853@spa.tournament","mobile":"07920115853","inputMobile":"07920 115853","playerName":"Andy Lammie","playerId":"cmeoo95u60004ssr3qw218mpk","playerRole":"player","userRole":"player"}',1756388561376);
INSERT INTO AuditLog VALUES('cmevrgjry0003jxe8yik54s38','cmevrgjru0001jxe8qmcol7zs','USER_SIGNUP','User','cmevrgjru0001jxe8qmcol7zs','{"email":"jonathan-robertson@hotmail.co.uk","mobile":"07749403710","inputMobile":"07749 403710","playerName":"Jonny Robertson","playerId":"cmeoo95v2000fssr31f0rn4vc","playerRole":"player","userRole":"player"}',1756407136030);
CREATE TABLE IF NOT EXISTS "FixtureAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fixtureId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "oldStatus" TEXT,
    "newStatus" TEXT,
    "changes" JSONB,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FixtureAudit_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FixtureAudit_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fixtureId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "metadata" JSONB,
    "readAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Message_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO Message VALUES('cmet1hjjh0005jx9xcg2q92rg','cmeoo95we000wssr3aehnyj85','cmeoo95v5000gssr3k7q8cc8t',replace('Your match details have been confirmed by Steven Couper:\n\nVenue: Ballers\nDate & Time: 29/08/2025, 21:08:00\n\nThe match is now public and visible in all fixture lists.','\n',char(10)),'text',NULL,NULL,1756242580014,1756242580014);
INSERT INTO Message VALUES('cmet255q9000pjx9xshpwbeb9','cmeoo95vo000nssr3c0qyolo5','cmeoo95tz0002ssr37zy02uhs',replace('Your match details have been confirmed by Neil Cochrane:\n\nVenue: Normandy\nDate & Time: 27/08/2025, 21:27:00\n\nThe match is now public and visible in all fixture lists.','\n',char(10)),'text',NULL,NULL,1756243681858,1756243681858);
INSERT INTO Message VALUES('cmet2cqqz002fjx9xt25s6uvh','cmeoo95wb000vssr3yxonkrch','cmeoo95uz000essr30m355m69',replace('Your match details have been confirmed by GAVIN HUNTER:\n\nVenue: Abbey Inn\nDate & Time: 28/08/2025, 21:33:00\n\nThe match is now public and visible in all fixture lists.','\n',char(10)),'text',NULL,1756411324997,1756244035692,1756411324997);
INSERT INTO Message VALUES('cmet3dcq60033jx9xetfforac','cmeoo95vl000mssr3l52k1n0q','cmeoo95tq0000ssr3q4vymayv',replace('Your match details have been confirmed by Steven Griggs:\n\nVenue: Abbey Inn\nDate & Time: 27/08/2025, 18:00:00\n\nThe match is now public and visible in all fixture lists.','\n',char(10)),'text',NULL,1756413439336,1756245743791,1756413439337);
INSERT INTO Message VALUES('cmet3jo7z004bjx9xr2ighfo9','cmeoo95vx000rssr34eyj24us','cmeoo95uc0006ssr3i7b75wnv','Alrite Stevie','text','null',1756290426832,1756246038624,1756290426833);
INSERT INTO Message VALUES('cmet3kkfr004fjx9xhshdfl1f','cmeoo95vx000rssr34eyj24us','cmeoo95uc0006ssr3i7b75wnv','You up for playing this tie on Friday 19:30 at ballers','text','null',1756290426832,1756246080376,1756290426833);
INSERT INTO Message VALUES('cmetu1yzj0005jxjaw650fvmt','cmeoo95vx000rssr34eyj24us','cmeoo95ue0007ssr37k07omem','Hi pal. Got something on Friday pal i can do Saturday or Sunday afternoon.','text','null',1756291017643,1756290562399,1756291017643);
INSERT INTO Message VALUES('cmeub9ink0001jxaqkkioflle','cmeoo95vx000rssr34eyj24us','cmeoo95uc0006ssr3i7b75wnv','Could do Saturday, what time you thinking?','text','null',1756320388264,1756319467953,1756320388264);
INSERT INTO Message VALUES('cmeudf8aw0001jxdnt4b6svyw','cmeoo95vx000rssr34eyj24us','cmeoo95ue0007ssr37k07omem','12 o''clock or 1 o''clock if that suits you','text','null',1756325318189,1756323093705,1756325318190);
INSERT INTO Message VALUES('cmeudkso70007jxrr99ifa0oz','cmeoo95w1000sssr38wh0pgjr','cmeoo95uh0008ssr3vxpokr04',replace('Your match details have been confirmed by Paul Hamilton:\n\nVenue: Ballers\nDate & Time: 29/08/2025, 18:30:00\n\nThe match is now public and visible in all fixture lists.','\n',char(10)),'text',NULL,NULL,1756323353384,1756323353384);
INSERT INTO Message VALUES('cmeuesen40001jxcnfblfkeb0','cmeoo95vx000rssr34eyj24us','cmeoo95uc0006ssr3i7b75wnv','Go for 12 mate, see you at ballers then 👍🏼','text','null',1756325478511,1756325388065,1756325478511);
INSERT INTO Message VALUES('cmeuetti10007jxcn4hx7ny8y','cmeoo95vx000rssr34eyj24us','cmeoo95uc0006ssr3i7b75wnv',replace('Your match details have been confirmed by Callum Brown:\n\nVenue: Ballers\nDate & Time: 30/08/2025, 12:00:00\n\nThe match is now public and visible in all fixture lists.','\n',char(10)),'text',NULL,1756325478511,1756325453978,1756325478511);
INSERT INTO Message VALUES('cmeuevg75000bjxcnyjy3euwi','cmeoo95vx000rssr34eyj24us','cmeoo95ue0007ssr37k07omem','See you then pal.','text','null',1756326265629,1756325530050,1756326265630);
CREATE TABLE IF NOT EXISTS "MessageTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "metadata" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE IF NOT EXISTS "LiveMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fixtureId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "lastActivityAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentFrame" INTEGER NOT NULL DEFAULT 1,
    "player1Frames" INTEGER NOT NULL DEFAULT 0,
    "player2Frames" INTEGER NOT NULL DEFAULT 0,
    "targetFrames" INTEGER NOT NULL DEFAULT 7,
    "createdBy" TEXT NOT NULL,
    "lastUpdatedBy" TEXT NOT NULL,
    "allowBothPlayersScore" BOOLEAN NOT NULL DEFAULT true,
    "requireConfirmation" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LiveMatch_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LiveMatch_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Fixture" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LiveMatch_lastUpdatedBy_fkey" FOREIGN KEY ("lastUpdatedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO LiveMatch VALUES('cmet25av7000tjx9xfnqkunya','cmeoo95vo000nssr3c0qyolo5','completed',1756243697049,1756243731048,1756243731048,12,7,4,7,'cmet23490000ljx9xw04va68o','cmet23490000ljx9xw04va68o',1,0,1756243688515,1756243731049);
INSERT INTO LiveMatch VALUES('cmet3dky00037jx9xreds3nxh','cmeoo95vl000mssr3l52k1n0q','completed',1756245756894,1756245766145,1756245766145,9,1,7,7,'cmet3c489002zjx9xk4645xi6','cmet3c489002zjx9xk4645xi6',1,0,1756245754440,1756245766146);
INSERT INTO LiveMatch VALUES('cmevrh05k0005jxe8fhzabtyc','cmeoo95wb000vssr3yxonkrch','waiting',NULL,NULL,1756407157257,1,0,0,7,'cmevrgjru0001jxe8qmcol7zs','cmevrgjru0001jxe8qmcol7zs',1,0,1756407157257,1756407157257);
INSERT INTO LiveMatch VALUES('cmevwp2bo0001jx5saci907k6','cmeoo95w1000sssr38wh0pgjr','paused',1756415941429,NULL,1756415944297,1,0,0,7,'cmeudib950001jxrrhlro54t4','cmeudib950001jxrrhlro54t4',1,0,1756415931396,1756415944298);
CREATE TABLE IF NOT EXISTS "FrameScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "liveMatchId" TEXT NOT NULL,
    "frameNumber" INTEGER NOT NULL,
    "winner" TEXT,
    "player1Score" INTEGER,
    "player2Score" INTEGER,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "enteredBy" TEXT NOT NULL,
    "confirmedBy" TEXT,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "wasReracked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FrameScore_confirmedBy_fkey" FOREIGN KEY ("confirmedBy") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "FrameScore_enteredBy_fkey" FOREIGN KEY ("enteredBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FrameScore_liveMatchId_fkey" FOREIGN KEY ("liveMatchId") REFERENCES "LiveMatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO FrameScore VALUES('cmet25nv3000zjx9xfqcrruky','cmet25av7000tjx9xfnqkunya',1,'player1',NULL,NULL,1756243705359,1756243705358,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243705359,1756243705359);
INSERT INTO FrameScore VALUES('cmet25p4o0013jx9xtai42maz','cmet25av7000tjx9xfnqkunya',2,'player1',NULL,NULL,1756243707001,1756243707000,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243707001,1756243707001);
INSERT INTO FrameScore VALUES('cmet25quo0017jx9xh0qjdn6g','cmet25av7000tjx9xfnqkunya',3,'player1',NULL,NULL,1756243709233,1756243709232,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243709233,1756243709233);
INSERT INTO FrameScore VALUES('cmet25sa6001bjx9xgco2orhl','cmet25av7000tjx9xfnqkunya',4,'player2',NULL,NULL,1756243711087,1756243711086,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243711087,1756243711087);
INSERT INTO FrameScore VALUES('cmet25tx0001fjx9xby1ojh47','cmet25av7000tjx9xfnqkunya',5,'player1',NULL,NULL,1756243713204,1756243713203,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243713204,1756243713204);
INSERT INTO FrameScore VALUES('cmet25zjq001jjx9xz4of0md5','cmet25av7000tjx9xfnqkunya',6,'player2',NULL,NULL,1756243720503,1756243720502,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243720503,1756243720503);
INSERT INTO FrameScore VALUES('cmet2623e001njx9xwo63qzib','cmet25av7000tjx9xfnqkunya',7,'player2',NULL,NULL,1756243723802,1756243723801,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243723802,1756243723802);
INSERT INTO FrameScore VALUES('cmet26552001rjx9xr6zblsew','cmet25av7000tjx9xfnqkunya',8,'player2',NULL,NULL,1756243727751,1756243727750,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243727751,1756243727751);
INSERT INTO FrameScore VALUES('cmet265m2001vjx9xfx76myzs','cmet25av7000tjx9xfnqkunya',9,'player1',NULL,NULL,1756243728362,1756243728361,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243728362,1756243728362);
INSERT INTO FrameScore VALUES('cmet267dc001zjx9xy5bva672','cmet25av7000tjx9xfnqkunya',10,'player1',NULL,NULL,1756243730641,1756243730640,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243730641,1756243730641);
INSERT INTO FrameScore VALUES('cmet267ol0023jx9x7m5yrma3','cmet25av7000tjx9xfnqkunya',11,'player1',NULL,NULL,1756243731046,1756243731045,'cmet23490000ljx9xw04va68o',NULL,1,NULL,0,1756243731046,1756243731046);
INSERT INTO FrameScore VALUES('cmet3dpd8003djx9xmwbauu7f','cmet3dky00037jx9xreds3nxh',1,'player2',NULL,NULL,1756245760172,1756245760172,'cmet3c489002zjx9xk4645xi6',NULL,1,NULL,0,1756245760172,1756245760172);
INSERT INTO FrameScore VALUES('cmet3dpu8003hjx9xkvefdlz8','cmet3dky00037jx9xreds3nxh',2,'player2',NULL,NULL,1756245760785,1756245760784,'cmet3c489002zjx9xk4645xi6',NULL,1,NULL,0,1756245760785,1756245760785);
INSERT INTO FrameScore VALUES('cmet3dqh2003ljx9xkd47pnsc','cmet3dky00037jx9xreds3nxh',3,'player2',NULL,NULL,1756245761607,1756245761606,'cmet3c489002zjx9xk4645xi6',NULL,1,NULL,0,1756245761607,1756245761607);
INSERT INTO FrameScore VALUES('cmet3dr3p003pjx9x7ta8vjlt','cmet3dky00037jx9xreds3nxh',4,'player2',NULL,NULL,1756245762422,1756245762421,'cmet3c489002zjx9xk4645xi6',NULL,1,NULL,0,1756245762422,1756245762422);
INSERT INTO FrameScore VALUES('cmet3drkx003tjx9xpa6blevl','cmet3dky00037jx9xreds3nxh',5,'player2',NULL,NULL,1756245763041,1756245763040,'cmet3c489002zjx9xk4645xi6',NULL,1,NULL,0,1756245763041,1756245763041);
INSERT INTO FrameScore VALUES('cmet3dson003xjx9x4f20tu8b','cmet3dky00037jx9xreds3nxh',6,'player1',NULL,NULL,1756245764471,1756245764471,'cmet3c489002zjx9xk4645xi6',NULL,1,NULL,0,1756245764471,1756245764471);
INSERT INTO FrameScore VALUES('cmet3dth30041jx9x5o6blrgc','cmet3dky00037jx9xreds3nxh',7,'player2',NULL,NULL,1756245765496,1756245765495,'cmet3c489002zjx9xk4645xi6',NULL,1,NULL,0,1756245765496,1756245765496);
INSERT INTO FrameScore VALUES('cmet3dtz30045jx9xlrn2mlgi','cmet3dky00037jx9xreds3nxh',8,'player2',NULL,NULL,1756245766143,1756245766142,'cmet3c489002zjx9xk4645xi6',NULL,1,NULL,0,1756245766143,1756245766143);
CREATE TABLE IF NOT EXISTS "ScoreUpdate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "liveMatchId" TEXT NOT NULL,
    "frameScoreId" TEXT,
    "updateType" TEXT NOT NULL,
    "previousState" JSONB,
    "newState" JSONB NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "reason" TEXT,
    CONSTRAINT "ScoreUpdate_frameScoreId_fkey" FOREIGN KEY ("frameScoreId") REFERENCES "FrameScore" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScoreUpdate_liveMatchId_fkey" FOREIGN KEY ("liveMatchId") REFERENCES "LiveMatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ScoreUpdate_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO ScoreUpdate VALUES('cmet25ave000vjx9xjbneiydu','cmet25av7000tjx9xfnqkunya',NULL,'match_start',NULL,'{"status":"waiting","createdBy":"cmet23490000ljx9xw04va68o"}',1756243688523,'cmet23490000ljx9xw04va68o','Match created');
INSERT INTO ScoreUpdate VALUES('cmet25hgg000xjx9xp6fkn8z4','cmet25av7000tjx9xfnqkunya',NULL,'match_start','{"status":"waiting"}','{"status":"in_progress","updatedAt":"2025-08-26T21:28:17.049Z"}',1756243697056,'cmet23490000ljx9xw04va68o','Match started by player');
INSERT INTO ScoreUpdate VALUES('cmet25nvc0011jx9xhaptbpgi','cmet25av7000tjx9xfnqkunya','cmet25nv3000zjx9xfqcrruky','frame_complete',NULL,'{"frameNumber":1,"winner":"player1","player1Frames":1,"player2Frames":0,"isMatchComplete":false}',1756243705369,'cmet23490000ljx9xw04va68o','Frame 1 won by player1');
INSERT INTO ScoreUpdate VALUES('cmet25p4w0015jx9xixfoom3e','cmet25av7000tjx9xfnqkunya','cmet25p4o0013jx9xtai42maz','frame_complete',NULL,'{"frameNumber":2,"winner":"player1","player1Frames":2,"player2Frames":0,"isMatchComplete":false}',1756243707008,'cmet23490000ljx9xw04va68o','Frame 2 won by player1');
INSERT INTO ScoreUpdate VALUES('cmet25quv0019jx9xbk6b602z','cmet25av7000tjx9xfnqkunya','cmet25quo0017jx9xh0qjdn6g','frame_complete',NULL,'{"frameNumber":3,"winner":"player1","player1Frames":3,"player2Frames":0,"isMatchComplete":false}',1756243709239,'cmet23490000ljx9xw04va68o','Frame 3 won by player1');
INSERT INTO ScoreUpdate VALUES('cmet25sae001djx9xabi7mdrj','cmet25av7000tjx9xfnqkunya','cmet25sa6001bjx9xgco2orhl','frame_complete',NULL,'{"frameNumber":4,"winner":"player2","player1Frames":3,"player2Frames":1,"isMatchComplete":false}',1756243711095,'cmet23490000ljx9xw04va68o','Frame 4 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet25tx8001hjx9xq0gd66st','cmet25av7000tjx9xfnqkunya','cmet25tx0001fjx9xby1ojh47','frame_complete',NULL,'{"frameNumber":5,"winner":"player1","player1Frames":4,"player2Frames":1,"isMatchComplete":false}',1756243713213,'cmet23490000ljx9xw04va68o','Frame 5 won by player1');
INSERT INTO ScoreUpdate VALUES('cmet25zjy001ljx9xzd8admi0','cmet25av7000tjx9xfnqkunya','cmet25zjq001jjx9xz4of0md5','frame_complete',NULL,'{"frameNumber":6,"winner":"player2","player1Frames":4,"player2Frames":2,"isMatchComplete":false}',1756243720511,'cmet23490000ljx9xw04va68o','Frame 6 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet2623l001pjx9x2n5i8cb8','cmet25av7000tjx9xfnqkunya','cmet2623e001njx9xwo63qzib','frame_complete',NULL,'{"frameNumber":7,"winner":"player2","player1Frames":4,"player2Frames":3,"isMatchComplete":false}',1756243723810,'cmet23490000ljx9xw04va68o','Frame 7 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet2655b001tjx9xbi99w98x','cmet25av7000tjx9xfnqkunya','cmet26552001rjx9xr6zblsew','frame_complete',NULL,'{"frameNumber":8,"winner":"player2","player1Frames":4,"player2Frames":4,"isMatchComplete":false}',1756243727759,'cmet23490000ljx9xw04va68o','Frame 8 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet265m9001xjx9xd5oi9biq','cmet25av7000tjx9xfnqkunya','cmet265m2001vjx9xfx76myzs','frame_complete',NULL,'{"frameNumber":9,"winner":"player1","player1Frames":5,"player2Frames":4,"isMatchComplete":false}',1756243728370,'cmet23490000ljx9xw04va68o','Frame 9 won by player1');
INSERT INTO ScoreUpdate VALUES('cmet267dk0021jx9xh4cw2as8','cmet25av7000tjx9xfnqkunya','cmet267dc001zjx9xy5bva672','frame_complete',NULL,'{"frameNumber":10,"winner":"player1","player1Frames":6,"player2Frames":4,"isMatchComplete":false}',1756243730648,'cmet23490000ljx9xw04va68o','Frame 10 won by player1');
INSERT INTO ScoreUpdate VALUES('cmet267ou0025jx9x5n0ih04t','cmet25av7000tjx9xfnqkunya','cmet267ol0023jx9x7m5yrma3','frame_complete',NULL,'{"frameNumber":11,"winner":"player1","player1Frames":7,"player2Frames":4,"isMatchComplete":true}',1756243731054,'cmet23490000ljx9xw04va68o','Frame 11 won by player1');
INSERT INTO ScoreUpdate VALUES('cmet3dky70039jx9x555sfsjf','cmet3dky00037jx9xreds3nxh',NULL,'match_start',NULL,'{"status":"waiting","createdBy":"cmet3c489002zjx9xk4645xi6"}',1756245754447,'cmet3c489002zjx9xk4645xi6','Match created');
INSERT INTO ScoreUpdate VALUES('cmet3dmub003bjx9xfb68uuq9','cmet3dky00037jx9xreds3nxh',NULL,'match_start','{"status":"waiting"}','{"status":"in_progress","updatedAt":"2025-08-26T22:02:36.894Z"}',1756245756899,'cmet3c489002zjx9xk4645xi6','Match started by player');
INSERT INTO ScoreUpdate VALUES('cmet3dpdf003fjx9x1d1k3n8d','cmet3dky00037jx9xreds3nxh','cmet3dpd8003djx9xmwbauu7f','frame_complete',NULL,'{"frameNumber":1,"winner":"player2","player1Frames":0,"player2Frames":1,"isMatchComplete":false}',1756245760179,'cmet3c489002zjx9xk4645xi6','Frame 1 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet3dpuj003jjx9xx6k7cyiw','cmet3dky00037jx9xreds3nxh','cmet3dpu8003hjx9xkvefdlz8','frame_complete',NULL,'{"frameNumber":2,"winner":"player2","player1Frames":0,"player2Frames":2,"isMatchComplete":false}',1756245760795,'cmet3c489002zjx9xk4645xi6','Frame 2 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet3dqh9003njx9xdraw8nni','cmet3dky00037jx9xreds3nxh','cmet3dqh2003ljx9xkd47pnsc','frame_complete',NULL,'{"frameNumber":3,"winner":"player2","player1Frames":0,"player2Frames":3,"isMatchComplete":false}',1756245761614,'cmet3c489002zjx9xk4645xi6','Frame 3 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet3dr3x003rjx9xttzylwby','cmet3dky00037jx9xreds3nxh','cmet3dr3p003pjx9x7ta8vjlt','frame_complete',NULL,'{"frameNumber":4,"winner":"player2","player1Frames":0,"player2Frames":4,"isMatchComplete":false}',1756245762430,'cmet3c489002zjx9xk4645xi6','Frame 4 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet3drl5003vjx9x5h6hjcbh','cmet3dky00037jx9xreds3nxh','cmet3drkx003tjx9xpa6blevl','frame_complete',NULL,'{"frameNumber":5,"winner":"player2","player1Frames":0,"player2Frames":5,"isMatchComplete":false}',1756245763049,'cmet3c489002zjx9xk4645xi6','Frame 5 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet3dsou003zjx9xy0q73622','cmet3dky00037jx9xreds3nxh','cmet3dson003xjx9x4f20tu8b','frame_complete',NULL,'{"frameNumber":6,"winner":"player1","player1Frames":1,"player2Frames":5,"isMatchComplete":false}',1756245764479,'cmet3c489002zjx9xk4645xi6','Frame 6 won by player1');
INSERT INTO ScoreUpdate VALUES('cmet3dtha0043jx9xynhs9788','cmet3dky00037jx9xreds3nxh','cmet3dth30041jx9x5o6blrgc','frame_complete',NULL,'{"frameNumber":7,"winner":"player2","player1Frames":1,"player2Frames":6,"isMatchComplete":false}',1756245765502,'cmet3c489002zjx9xk4645xi6','Frame 7 won by player2');
INSERT INTO ScoreUpdate VALUES('cmet3dtz90047jx9xs1qh37l2','cmet3dky00037jx9xreds3nxh','cmet3dtz30045jx9xlrn2mlgi','frame_complete',NULL,'{"frameNumber":8,"winner":"player2","player1Frames":1,"player2Frames":7,"isMatchComplete":true}',1756245766149,'cmet3c489002zjx9xk4645xi6','Frame 8 won by player2');
INSERT INTO ScoreUpdate VALUES('cmevrh05u0007jxe8p2akrgyl','cmevrh05k0005jxe8fhzabtyc',NULL,'match_start',NULL,'{"status":"waiting","createdBy":"cmevrgjru0001jxe8qmcol7zs"}',1756407157266,'cmevrgjru0001jxe8qmcol7zs','Match created');
INSERT INTO ScoreUpdate VALUES('cmevwp2bw0003jx5ssprkp5j7','cmevwp2bo0001jx5saci907k6',NULL,'match_start',NULL,'{"status":"waiting","createdBy":"cmeudib950001jxrrhlro54t4"}',1756415931405,'cmeudib950001jxrrhlro54t4','Match created');
INSERT INTO ScoreUpdate VALUES('cmevwpa2j0005jx5syugbb6k6','cmevwp2bo0001jx5saci907k6',NULL,'match_start','{"status":"waiting"}','{"status":"in_progress","updatedAt":"2025-08-28T21:19:01.429Z"}',1756415941435,'cmeudib950001jxrrhlro54t4','Match started by player');
INSERT INTO ScoreUpdate VALUES('cmevwpca70007jx5sf9r954pb','cmevwp2bo0001jx5saci907k6',NULL,'match_pause','{"status":"in_progress"}','{"status":"paused","updatedAt":"2025-08-28T21:19:04.297Z"}',1756415944303,'cmeudib950001jxrrhlro54t4','Match paused by player');
CREATE TABLE IF NOT EXISTS "AreaQualifier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "qualifiedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromFixture" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "tournamentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AreaQualifier_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_playerId_key" ON "User"("playerId");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "Player_mobile_key" ON "Player"("mobile");
CREATE INDEX "Player_mobile_idx" ON "Player"("mobile");
CREATE INDEX "Player_role_idx" ON "Player"("role");
CREATE INDEX "Fixture_round_idx" ON "Fixture"("round");
CREATE INDEX "Fixture_status_idx" ON "Fixture"("status");
CREATE INDEX "Fixture_playerAId_playerBId_idx" ON "Fixture"("playerAId", "playerBId");
CREATE INDEX "Frame_fixtureId_idx" ON "Frame"("fixtureId");
CREATE UNIQUE INDEX "Frame_fixtureId_frameNumber_key" ON "Frame"("fixtureId", "frameNumber");
CREATE INDEX "Document_visibility_idx" ON "Document"("visibility");
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX "FixtureAudit_fixtureId_idx" ON "FixtureAudit"("fixtureId");
CREATE INDEX "FixtureAudit_actorId_idx" ON "FixtureAudit"("actorId");
CREATE INDEX "FixtureAudit_action_idx" ON "FixtureAudit"("action");
CREATE INDEX "FixtureAudit_createdAt_idx" ON "FixtureAudit"("createdAt");
CREATE INDEX "Message_fixtureId_idx" ON "Message"("fixtureId");
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");
CREATE INDEX "MessageTemplate_category_idx" ON "MessageTemplate"("category");
CREATE INDEX "MessageTemplate_isActive_idx" ON "MessageTemplate"("isActive");
CREATE UNIQUE INDEX "LiveMatch_fixtureId_key" ON "LiveMatch"("fixtureId");
CREATE INDEX "LiveMatch_fixtureId_idx" ON "LiveMatch"("fixtureId");
CREATE INDEX "LiveMatch_status_idx" ON "LiveMatch"("status");
CREATE INDEX "LiveMatch_createdBy_idx" ON "LiveMatch"("createdBy");
CREATE INDEX "LiveMatch_lastActivityAt_idx" ON "LiveMatch"("lastActivityAt");
CREATE INDEX "FrameScore_liveMatchId_idx" ON "FrameScore"("liveMatchId");
CREATE INDEX "FrameScore_frameNumber_idx" ON "FrameScore"("frameNumber");
CREATE INDEX "FrameScore_winner_idx" ON "FrameScore"("winner");
CREATE UNIQUE INDEX "FrameScore_liveMatchId_frameNumber_key" ON "FrameScore"("liveMatchId", "frameNumber");
CREATE INDEX "ScoreUpdate_liveMatchId_idx" ON "ScoreUpdate"("liveMatchId");
CREATE INDEX "ScoreUpdate_frameScoreId_idx" ON "ScoreUpdate"("frameScoreId");
CREATE INDEX "ScoreUpdate_updateType_idx" ON "ScoreUpdate"("updateType");
CREATE INDEX "ScoreUpdate_timestamp_idx" ON "ScoreUpdate"("timestamp");
CREATE UNIQUE INDEX "AreaQualifier_playerId_key" ON "AreaQualifier"("playerId");
CREATE UNIQUE INDEX "AreaQualifier_fromFixture_key" ON "AreaQualifier"("fromFixture");
CREATE UNIQUE INDEX "AreaQualifier_position_key" ON "AreaQualifier"("position");
COMMIT;
