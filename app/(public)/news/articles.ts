export interface Article {
    id: number;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    views: string;
    isFeatured: boolean;
    author: string;
    content: string[];
}

export const articles: Article[] = [
    {
        id: 1,
        title: "5 Kebiasaan Sehari-hari yang Membuat Rice Cooker Cepat Rusak",
        excerpt:
            "Hindari kesalahan umum dalam penggunaan rice cooker yang dapat memperpendek umur perangkat Anda. Pelajari cara perawatan yang benar untuk investasi dapur jangka panjang.",
        image:
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200&q=80",
        category: "Tips & Trik",
        date: "15 Januari 2026",
        readTime: "5 min",
        views: "2.5k",
        isFeatured: true,
        author: "Tim Ravelle",
        content: [
            "Rice cooker merupakan salah satu peralatan dapur yang paling sering digunakan di rumah tangga Indonesia. Namun, tanpa disadari, ada beberapa kebiasaan sehari-hari yang justru bisa mempercepat kerusakan pada rice cooker Anda.",
            "Kebiasaan pertama yang harus dihindari adalah mencuci inner pot dengan bahan abrasif. Banyak orang menggunakan spons kasar atau sabun yang keras untuk membersihkan bagian dalam rice cooker. Padahal, lapisan anti-lengket pada inner pot sangat sensitif dan mudah tergores. Gunakan spons lembut dan sabun cuci piring biasa untuk membersihkannya.",
            "Kebiasaan kedua adalah memasukkan beras tanpa mencucinya terlebih dahulu. Pati yang berlebih pada beras yang tidak dicuci dapat menempel pada bagian bawah inner pot dan elemen pemanas, sehingga menyebabkan kerak yang sulit dibersihkan dan mengurangi efisiensi pemanasan.",
            "Kebiasaan ketiga yang sering dilakukan adalah membiarkan nasi terlalu lama dalam mode keep warm. Meskipun fitur keep warm sangat berguna, membiarkan nasi lebih dari 12 jam dapat menyebabkan nasi menjadi kering, berbau, dan meninggalkan kerak pada inner pot yang sulit dibersihkan.",
            "Kebiasaan keempat adalah tidak membersihkan uap vent secara rutin. Bagian ventilasi uap pada tutup rice cooker sering terabaikan saat membersihkan rice cooker. Padahal, sisa uap yang mengering di bagian ini bisa menjadi sarang bakteri dan menghambat proses penguapan yang optimal.",
            "Kebiasaan kelima adalah meletakkan rice cooker di tempat yang lembap atau dekat dengan sumber air. Kelembapan berlebih bisa menyebabkan korosi pada komponen elektronik di dalam rice cooker. Pastikan Anda meletakkan rice cooker di tempat yang kering dan memiliki sirkulasi udara yang baik.",
            "Dengan menghindari kelima kebiasaan di atas, Anda dapat memperpanjang umur rice cooker dan memastikan performa memasak yang optimal setiap hari. Investasikan sedikit waktu untuk merawat peralatan dapur Anda, dan nikmati hasil nasi yang selalu sempurna.",
        ],
    },
    {
        id: 2,
        title: "Fungsi Tersembunyi Rice Cooker yang Jarang Disadari",
        excerpt:
            "Rice cooker Anda bisa lebih dari sekedar memasak nasi. Temukan berbagai fungsi tersembunyi yang akan mengubah cara Anda memasak sehari-hari.",
        image:
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
        category: "Tutorial",
        date: "12 Januari 2026",
        readTime: "7 min",
        views: "3.2k",
        isFeatured: true,
        author: "Chef Maria",
        content: [
            "Rice cooker sering dianggap sebagai alat dapur yang hanya bisa memasak nasi. Padahal, perangkat serbaguna ini memiliki banyak fungsi tersembunyi yang jarang disadari oleh penggunanya.",
            "Salah satu fungsi tersembunyi rice cooker adalah kemampuannya untuk mengukus berbagai jenis makanan. Dengan menggunakan steamer tray yang biasanya sudah disertakan, Anda bisa mengukus sayuran, ikan, atau bahkan dim sum dengan hasil yang sempurna.",
            "Rice cooker juga bisa digunakan untuk membuat kue sederhana seperti sponge cake atau banana cake. Caranya cukup mudah: siapkan adonan kue seperti biasa, tuangkan ke dalam inner pot yang sudah diolesi mentega, lalu tekan tombol cook. Hasilnya, kue yang empuk dan matang merata.",
            "Anda juga bisa menggunakan rice cooker untuk membuat sup atau bubur. Cukup masukkan semua bahan ke dalam inner pot, tambahkan air secukupnya, dan biarkan rice cooker bekerja. Fitur keep warm akan menjaga sup tetap hangat hingga siap disajikan.",
            "Fungsi lain yang jarang diketahui adalah kemampuan rice cooker untuk memasak pasta. Masukkan pasta kering ke dalam inner pot bersama air dan sedikit minyak zaitun. Hasilnya, pasta yang al dente tanpa perlu mengawasi kompor.",
            "Dengan mengetahui berbagai fungsi tersembunyi ini, Anda bisa memaksimalkan penggunaan rice cooker dan menghemat waktu serta energi dalam memasak sehari-hari.",
        ],
    },
    {
        id: 3,
        title: "Cara Membersihkan Blender Agar Tetap Awet dan Higienis",
        excerpt:
            "Panduan lengkap membersihkan blender dengan benar untuk menjaga kebersihan dan memperpanjang umur perangkat. Tips praktis dari ahli.",
        image:
            "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80",
        category: "Panduan",
        date: "10 Januari 2026",
        readTime: "6 min",
        views: "1.8k",
        isFeatured: false,
        author: "Dr. Clean",
        content: [
            "Blender adalah salah satu peralatan dapur yang paling sering digunakan untuk membuat jus, smoothie, dan berbagai olahan makanan lainnya. Namun, jika tidak dibersihkan dengan benar, blender bisa menjadi sarang bakteri dan menurunkan kualitas makanan.",
            "Langkah pertama yang harus dilakukan setelah menggunakan blender adalah membilasnya segera dengan air hangat. Jangan biarkan sisa makanan mengering di dalam wadah blender karena akan semakin sulit dibersihkan.",
            "Untuk pembersihan rutin, Anda bisa menggunakan trik sederhana: isi wadah blender dengan air hangat dan beberapa tetes sabun cuci piring, lalu jalankan blender selama 30 detik. Metode ini efektif membersihkan sisa makanan yang menempel pada pisau dan dinding wadah.",
            "Jangan lupa membersihkan bagian karet seal dan ring pada dasar wadah blender. Bagian ini sering terlewat dan bisa menjadi tempat penumpukan sisa makanan yang membusuk. Lepas ring secara berkala dan bersihkan dengan sikat kecil.",
            "Untuk menghilangkan bau tidak sedap, Anda bisa menggunakan campuran baking soda dan air lemon. Masukkan satu sendok makan baking soda dan perasan setengah lemon ke dalam wadah blender berisi air, lalu jalankan selama satu menit.",
            "Dengan perawatan yang tepat, blender Anda akan tetap higienis dan performanya akan terjaga dalam jangka waktu yang panjang.",
        ],
    },
    {
        id: 4,
        title: "Kesalahan Umum Menggunakan Juicer yang Harus Dihindari",
        excerpt:
            "Maksimalkan hasil jus Anda dan hindari kerusakan pada juicer dengan menghindari kesalahan-kesalahan umum yang sering dilakukan pemula.",
        image:
            "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800&q=80",
        category: "Tips & Trik",
        date: "8 Januari 2026",
        readTime: "5 min",
        views: "2.1k",
        isFeatured: false,
        author: "Nutrisi Expert",
        content: [
            "Juicer adalah alat yang luar biasa untuk mendapatkan jus segar setiap hari. Namun, banyak pengguna pemula yang melakukan kesalahan yang dapat merusak juicer atau mengurangi kualitas jus yang dihasilkan.",
            "Kesalahan pertama adalah memasukkan buah atau sayuran yang terlalu besar tanpa memotongnya terlebih dahulu. Ini bisa membuat motor juicer bekerja terlalu keras dan memperpendek umurnya. Selalu potong bahan menjadi ukuran yang sesuai dengan lubang masukan juicer.",
            "Kesalahan kedua adalah tidak membersihkan juicer segera setelah digunakan. Sisa serat dan pulp yang mengering akan sangat sulit dibersihkan dan bisa menjadi sarang bakteri. Biasakan untuk langsung membersihkan juicer setelah selesai digunakan.",
            "Kesalahan ketiga adalah menggunakan juicer untuk bahan yang tidak sesuai, seperti biji-bijian keras atau rempah-rempah kering. Bahan-bahan ini bisa merusak pisau dan saringan juicer. Gunakan blender atau grinder untuk bahan-bahan seperti ini.",
            "Kesalahan keempat adalah tidak memasukkan bahan secara bergantian antara yang keras dan lunak. Teknik ini membantu mendorong sisa bahan yang lunak dan memaksimalkan ekstraksi jus.",
            "Dengan menghindari kesalahan-kesalahan di atas, Anda akan mendapatkan jus yang lebih berkualitas dan menjaga juicer tetap awet untuk waktu yang lama.",
        ],
    },
    {
        id: 5,
        title: "Tren Peralatan Dapur Modern di Tahun 2026",
        excerpt:
            "Simak tren terbaru dalam dunia peralatan dapur yang akan membuat aktivitas memasak Anda lebih efisien, hemat energi, dan menyenangkan.",
        image:
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80",
        category: "Trend",
        date: "5 Januari 2026",
        readTime: "8 min",
        views: "4.5k",
        isFeatured: false,
        author: "Tim Ravelle",
        content: [
            "Tahun 2026 membawa banyak inovasi menarik dalam dunia peralatan dapur. Dari teknologi smart home hingga desain yang lebih ramah lingkungan, tren tahun ini menjanjikan pengalaman memasak yang lebih menyenangkan dan efisien.",
            "Tren pertama adalah integrasi IoT (Internet of Things) pada peralatan dapur. Rice cooker, oven, dan bahkan blender kini bisa dikontrol melalui smartphone. Anda bisa mengatur waktu memasak, suhu, dan bahkan menerima notifikasi ketika makanan sudah siap.",
            "Tren kedua adalah material ramah lingkungan. Banyak produsen peralatan dapur yang mulai beralih ke material yang lebih sustainable, seperti bambu, stainless steel daur ulang, dan plastik bio-degradable.",
            "Tren ketiga adalah desain minimalis dengan fitur maksimal. Peralatan dapur modern hadir dengan desain yang sleek dan compact, namun tetap memiliki fitur-fitur canggih yang memudahkan proses memasak.",
            "Tren keempat adalah peralatan dapur multifungsi. Konsumen modern menginginkan peralatan yang bisa melakukan berbagai fungsi dalam satu alat, menghemat ruang dan budget.",
            "Tren kelima adalah fokus pada efisiensi energi. Peralatan dapur terbaru dirancang untuk mengonsumsi listrik lebih sedikit tanpa mengorbankan performa, sejalan dengan kesadaran global akan pentingnya penghematan energi.",
            "Dengan mengikuti tren-tren ini, Anda bisa memperbarui dapur Anda dengan peralatan yang tidak hanya modern, tetapi juga lebih efisien dan ramah lingkungan.",
        ],
    },
    {
        id: 6,
        title: "Resep Sehat dengan Peralatan Dapur Ravelle",
        excerpt:
            "Kumpulan resep sehat dan praktis yang bisa Anda buat menggunakan peralatan dapur Ravelle kesayangan Anda. Mudah dan lezat!",
        image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
        category: "Resep",
        date: "3 Januari 2026",
        readTime: "10 min",
        views: "5.3k",
        isFeatured: false,
        author: "Chef Budi",
        content: [
            "Memasak makanan sehat tidak harus rumit dan memakan waktu lama. Dengan peralatan dapur Ravelle, Anda bisa membuat berbagai hidangan sehat dan lezat dengan mudah.",
            "Resep pertama: Smoothie Bowl Tropical. Gunakan blender Ravelle untuk memblend 1 buah pisang beku, 100g mangga beku, dan 100ml susu almond hingga halus. Tuang ke dalam mangkuk dan beri topping granola, irisan buah segar, dan madu.",
            "Resep kedua: Nasi Merah Organik. Gunakan rice cooker Ravelle dengan mode brown rice untuk memasak nasi merah dengan sempurna. Tambahkan sedikit garam dan minyak kelapa untuk rasa yang lebih gurih.",
            "Resep ketiga: Jus Detox Hijau. Dengan juicer Ravelle, proses 2 batang seledri, 1 buah apel hijau, setengah lemon, dan sedikit jahe. Jus ini kaya antioksidan dan sangat baik untuk memulai hari Anda.",
            "Resep keempat: Ayam Kukus Jahe. Gunakan steamer tray pada rice cooker Ravelle. Marinasi ayam fillet dengan jahe parut, kecap, dan minyak wijen selama 30 menit, lalu kukus hingga matang. Sajikan dengan nasi hangat dan sayuran segar.",
            "Semua resep di atas bisa disiapkan dalam waktu kurang dari 30 menit, menjadikannya pilihan sempurna untuk Anda yang ingin makan sehat tanpa menghabiskan banyak waktu di dapur.",
        ],
    },
    {
        id: 7,
        title: "Panduan Memilih Rice Cooker Sesuai Kebutuhan Keluarga",
        excerpt:
            "Tips memilih rice cooker yang tepat berdasarkan jumlah anggota keluarga, fitur yang dibutuhkan, dan budget yang tersedia.",
        image:
            "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
        category: "Panduan",
        date: "1 Januari 2026",
        readTime: "6 min",
        views: "3.7k",
        isFeatured: false,
        author: "Tim Ravelle",
        content: [
            "Memilih rice cooker yang tepat adalah investasi penting untuk dapur Anda. Rice cooker yang sesuai dengan kebutuhan keluarga akan memastikan nasi yang sempurna setiap hari dan awet digunakan dalam jangka waktu lama.",
            "Untuk keluarga kecil (1-2 orang), rice cooker dengan kapasitas 0.6-1 liter sudah cukup. Pilih model yang compact dan efisien energi. Fitur dasar seperti cook dan keep warm sudah memadai untuk kebutuhan sehari-hari.",
            "Untuk keluarga sedang (3-4 orang), kapasitas 1-1.8 liter adalah pilihan ideal. Pertimbangkan rice cooker dengan fitur multi-cook yang bisa memasak berbagai jenis beras, bubur, dan bahkan mengukus makanan.",
            "Untuk keluarga besar (5+ orang), pilih rice cooker dengan kapasitas 1.8-3 liter. Fitur-fitur canggih seperti fuzzy logic, pressure cooking, dan timer sangat berguna untuk mengatur waktu memasak yang lebih fleksibel.",
            "Selain kapasitas, perhatikan juga jenis inner pot. Inner pot dengan lapisan anti-lengket berkualitas tinggi akan memudahkan pembersihan dan menghasilkan nasi yang lebih merata matangnya.",
            "Jangan lupa mempertimbangkan garansi dan layanan after-sales. Rice cooker Ravelle hadir dengan garansi resmi 1 tahun dan jaringan servis yang luas di seluruh Indonesia, memberikan ketenangan pikiran untuk investasi dapur Anda.",
        ],
    },
    {
        id: 8,
        title: "Hemat Listrik dengan Teknik Memasak yang Tepat",
        excerpt:
            "Cara menggunakan peralatan dapur dengan bijak untuk menghemat tagihan listrik bulanan tanpa mengurangi kualitas masakan.",
        image:
            "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&q=80",
        category: "Tips & Trik",
        date: "28 Desember 2025",
        readTime: "5 min",
        views: "2.9k",
        isFeatured: false,
        author: "Energy Saver",
        content: [
            "Tagihan listrik yang membengkak sering kali disebabkan oleh penggunaan peralatan dapur yang tidak efisien. Dengan teknik memasak yang tepat, Anda bisa menghemat energi secara signifikan tanpa mengurangi kualitas masakan.",
            "Tips pertama: manfaatkan fitur timer pada peralatan dapur Anda. Atur rice cooker atau oven untuk mulai memasak sebelum Anda pulang kerja, sehingga peralatan hanya beroperasi selama waktu yang diperlukan.",
            "Tips kedua: gunakan tutup saat memasak. Memasak dengan tutup bisa mengurangi waktu memasak hingga 25%, karena panas terperangkap di dalam dan memasak makanan lebih cepat.",
            "Tips ketiga: pilih ukuran peralatan yang sesuai dengan porsi makanan. Menggunakan rice cooker besar untuk memasak porsi kecil adalah pemborosan energi. Sesuaikan peralatan dengan kebutuhan actual Anda.",
            "Tips keempat: matikan peralatan dari stop kontak setelah selesai digunakan. Banyak peralatan dapur yang tetap mengonsumsi listrik dalam mode standby. Cabut kabel dari stop kontak untuk menghemat energi.",
            "Tips kelima: rawat peralatan dapur secara rutin. Peralatan yang bersih dan terawat bekerja lebih efisien dibandingkan peralatan yang kotor atau berkerak. Bersihkan elemen pemanas dan filter secara berkala.",
            "Dengan menerapkan tips-tips di atas, Anda bisa menghemat hingga 20% dari tagihan listrik bulanan tanpa harus mengorbankan kenyamanan memasak.",
        ],
    },
];
