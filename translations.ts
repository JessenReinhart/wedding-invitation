export type Language = 'id' | 'en' | 'ko';

export const translations = {
    id: {
        nav: {
            bride: 'Mempelai',
            location: 'Lokasi',
            event: 'Acara',
            rsvp: 'Konfirmasi',
            gift: 'Hadiah',
        },
        hero: {
            location: 'Jakarta',
            celebration: 'Perayaan Pernikahan',
            venue: 'Amanaia Menteng',
        },
        couple: {
            brideTitle: 'Mempelai Wanita',
            daughterOf: 'Putri dari\nAlmarhum Tommy Sitorus\n&\nSri Djuhariah',
            groomTitle: 'Mempelai Pria',
            sonOf: 'Putra dari\nAlmarhum Sugiarto Seno\n&\nYessy Wahyuni',
        },
        venue: {
            title: 'Lokasi',
            city: 'JAKARTA, INDONESIA',
            quote: '"Keanggunan dalam kesederhanaan, sebuah ruang untuk merayakan cinta yang abadi."',
            description1: 'Amanaia Menteng menjadi saksi penyatuan janji suci kami. Dengan arsitektur yang memadukan kekuatan struktur dan kelembutan alam, tempat ini melambangkan fondasi hubungan kami yang kokoh namun terus bertumbuh dengan indah.',
            description2: 'Prosesi Akad Nikah akan dilangsungkan dengan khidmat di area taman, menyatu dengan alam, dilanjutkan dengan perayaan hangat bersama orang-orang terkasih.',
            directions: 'Petunjuk Arah',
            address: 'Jl. Dr. Abdul Rahman Saleh I No.12, Kwitang, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10410',
            openMap: 'Buka Google Maps',
        },
        event: {
            title: 'Susunan Acara',
            date: '02 Mei 2026',
            items: [
                {
                    time: "09:00",
                    title: "Akad Nikah",
                    description: "Janji suci di hadapan keluarga dan kerabat terdekat."
                },
                {
                    time: "11:00",
                    title: "Resepsi Makan Siang",
                    description: "Jamuan makan siang intim dengan hidangan kuliner nusantara modern."
                },
                {
                    time: "13:00",
                    title: "Hiburan & Permainan",
                    description: "Momen santai penuh tawa, permainan, dan musik."
                }
            ],
            dressCodeTitle: 'Busana: Formal & Elegan',
            dressCodeDesc1: 'Kami mengharapkan kehadiran Anda dengan balutan busana berwarna netral atau earth tone. Sentuhan merah anggur (wine) sangat diapresiasi untuk menyelaraskan suasana.',
            dressCodeDesc2: 'Bagi tamu wanita, dimohon untuk menghindari busana berwarna Ivory atau Broken White.',
        },
        rsvp: {
            title: 'Konfirmasi',
            subtitle: 'Mohon konfirmasi kehadiran Anda sebelum 1 Maret 2026',
            successTitle: 'Terima Kasih',
            successDesc: 'Kami telah menerima respon Anda. Kami menantikan kehadiran Anda di Jakarta.',
            firstName: 'Nama Depan',
            lastName: 'Nama Belakang',
            email: 'Alamat Email',
            attendance: 'Kehadiran',
            attending: 'Hadir',
            notAttending: 'Berhalangan',
            dietary: 'Pantangan Makanan / Alergi',
            submit: 'Kirim Konfirmasi',
        },
        footer: {
            gift: 'Hadiah',
            accommodation: 'Akomodasi',
            contact: 'Kontak',
        },
        gift: {
            title: 'Wedding Gift',
            description: 'Doa restu Anda merupakan karunia terindah bagi kami. Namun, jika Anda ingin memberikan tanda kasih, kami menyediakan \'Digital Envelope\' untuk memudahkan Anda.',
            bankName: 'Bank Jago',
            accountName: 'Muhammad Jessen Reinhart S',
            accountNumber: '104226176041',
            copyButton: 'Salin No. Rekening',
            copied: 'Tersalin!',
        }
    },
    en: {
        nav: {
            bride: 'The Couple',
            location: 'Location',
            event: 'Events',
            rsvp: 'RSVP',
            gift: 'Gift',
        },
        hero: {
            location: 'Jakarta',
            celebration: 'Wedding Celebration',
            venue: 'Amanaia Menteng',
        },
        couple: {
            brideTitle: 'The Bride',
            daughterOf: 'Daughter of\nthe late Tommy Sitorus\n&\nMrs. Sri Djuhariah',
            groomTitle: 'The Groom',
            sonOf: 'Son of\nthe late Sugiarto Seno\n&\nYessy Wahyuni',
        },
        venue: {
            title: 'Location',
            city: 'JAKARTA, INDONESIA',
            quote: '"Elegance in simplicity, a space to celebrate eternal love."',
            description1: 'Amanaia Menteng bears witness to our sacred union. With architecture that blends structural strength with natural softness, this place symbolizes the foundation of our relationship—strong yet growing beautifully.',
            description2: 'The Holy Matrimony will be held solemnly in the garden area, at one with nature, followed by a warm celebration with loved ones.',
            directions: 'Directions',
            address: 'Jl. Dr. Abdul Rahman Saleh I No.12, Kwitang, Kec. Senen, Central Jakarta City, Jakarta 10410',
            openMap: 'Open Google Maps',
        },
        event: {
            title: 'Itinerary',
            date: 'May 02, 2026',
            items: [
                {
                    time: "09:00",
                    title: "Holy Matrimony",
                    description: "Sacred vows in the presence of family and closest relatives."
                },
                {
                    time: "11:00",
                    title: "Lunch Reception",
                    description: "An intimate lunch featuring modern Indonesian culinary delights."
                },
                {
                    time: "13:00",
                    title: "Entertainment & Games",
                    description: "Relaxed moments full of laughter, games, and music."
                }
            ],
            dressCodeTitle: 'Dress Code: Formal & Elegant',
            dressCodeDesc1: 'We request your presence in neutral or earth-tone attire. A touch of wine red is highly appreciated to harmonize with the atmosphere.',
            dressCodeDesc2: 'For female guests, please kindly avoid wearing Ivory or Broken White.',
        },
        rsvp: {
            title: 'RSVP',
            subtitle: 'Please confirm your attendance before March 1, 2026',
            successTitle: 'Thank You',
            successDesc: 'We have received your response. We look forward to seeing you in Jakarta.',
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email Address',
            attendance: 'Attendance',
            attending: 'Attending',
            notAttending: 'Not Attending',
            dietary: 'Dietary Restrictions / Allergies',
            submit: 'Send Confirmation',
        },
        footer: {
            gift: 'Gift',
            accommodation: 'Accommodation',
            contact: 'Contact',
        },
        gift: {
            title: 'Wedding Gift',
            description: 'Your blessing is the greatest gift for us. However, if you wish to give a token of love, we provide a \'Digital Envelope\' for your convenience.',
            bankName: 'Bank Jago',
            accountName: 'Muhammad Jessen Reinhart S',
            accountNumber: '104226176041',
            copyButton: 'Copy Account Number',
            copied: 'Copied!',
        }
    },
    ko: {
        nav: {
            bride: '신랑 신부',
            location: '장소',
            event: '일정',
            rsvp: '참석 여부',
            gift: '축의금',
        },
        hero: {
            location: '자카르타',
            celebration: '결혼식',
            venue: '아마나이아 멘텡',
        },
        couple: {
            brideTitle: '신부',
            daughterOf: '故 토미 시토루스와\n스리 주하리아 여사의\n딸',
            groomTitle: '신랑',
            sonOf: '故 수기아르토 세노와\n예시 와유니의\n아들',
        },
        venue: {
            title: '장소',
            city: '자카르타, 인도네시아',
            quote: '"단순함 속의 우아함, 영원한 사랑을 기념하는 공간."',
            description1: '아마나이아 멘텡은 우리의 성스러운 서약을 증명하는 곳입니다. 구조적 강인함과 자연의 부드러움을 조화시킨 건축물처럼, 이곳은 견고하면서도 아름답게 성장하는 우리 관계의 토대를 상징합니다.',
            description2: '결혼 서약식은 자연과 하나 되는 정원에서 엄숙하게 거행되며, 이후 사랑하는 이들과 함께 따뜻한 축하 연회가 이어집니다.',
            directions: '오시는 길',
            address: 'Jl. Dr. Abdul Rahman Saleh I No.12, Kwitang, Kec. Senen, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10410',
            openMap: '구글 지도 열기',
        },
        event: {
            title: '일정',
            date: '2026년 5월 2일',
            items: [
                {
                    time: "09:00",
                    title: "결혼 서약식",
                    description: "가족과 가장 가까운 친지들 앞에서 맺는 성스러운 서약."
                },
                {
                    time: "11:00",
                    title: "점심 리셉션",
                    description: "현대적인 인도네시아 요리와 함께하는 오붓한 점심 식사."
                },
                {
                    time: "13:00",
                    title: "엔터테인먼트 & 게임",
                    description: "웃음과 게임, 음악이 가득한 편안한 시간."
                }
            ],
            dressCodeTitle: '드레스 코드: 포멀 & 엘레강스',
            dressCodeDesc1: '중성적인 색상이나 어스톤 의상을 착용해 주시기를 부탁드립니다. 와인 레드 컬러로 포인트를 주시면 분위기와 잘 어우러집니다.',
            dressCodeDesc2: '여성 하객분들께서는 아이보리나 브로큰 화이트 색상의 의상은 피해주시면 감사하겠습니다.',
        },
        rsvp: {
            title: '참석 여부',
            subtitle: '2026년 3월 1일까지 참석 여부를 알려주세요',
            successTitle: '감사합니다',
            successDesc: '답변이 접수되었습니다. 자카르타에서 뵙기를 고대합니다.',
            firstName: '이름',
            lastName: '성',
            email: '이메일 주소',
            attendance: '참석 여부',
            attending: '참석',
            notAttending: '불참',
            dietary: '식단 제한 / 알레르기',
            submit: '확인 전송',
        },
        footer: {
            gift: '선물',
            accommodation: '숙박',
            contact: '연락처',
        },
        gift: {
            title: '축의금',
            description: '저희의 새로운 시작을 축복해 주시는 마음만으로도 충분히 감사합니다. 축하의 마음을 전하고 싶으신 분들을 위해 계좌 번호를 안내해 드립니다.',
            bankName: 'Bank Jago',
            accountName: 'Muhammad Jessen Reinhart S',
            accountNumber: '104226176041',
            copyButton: '계좌 번호 복사',
            copied: '복사됨!',
        }
    }
};

export type TranslationKeys = typeof translations.id;
