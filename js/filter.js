document.addEventListener('DOMContentLoaded', () => {

    const allCourses = [
        { id: 'manajemen-kas', title: 'Manajemen Kas Lanjutan', category: 'Keuangan', progress: 80, image: 'https://placehold.co/600x338/2A2D3E/E0E0E0?text=Manajemen+Kas', description: 'Pelajari teknik lanjutan untuk mengoptimalkan arus kas dan meningkatkan likuiditas usaha Anda.' },
        { id: 'dasar-akuntansi', title: 'Akuntansi untuk UMKM', category: 'Akuntansi', progress: 40, image: 'https://placehold.co/600x338/2A2D3E/E0E0E0?text=Akuntansi+UMKM', description: 'Pahami dasar-dasar akuntansi yang esensial untuk mencatat transaksi dan membuat laporan keuangan sederhana.' },
        { id: 'pemasaran-digital', title: 'Pemasaran Digital 101', category: 'Pemasaran', progress: 0, image: 'https://placehold.co/600x338/2A2D3E/E0E0E0?text=Pemasaran+101', description: 'Kenali berbagai kanal pemasaran digital dan cara memanfaatkannya untuk menjangkau lebih banyak pelanggan.' },
        { id: 'pajak', title: 'Strategi Perpajakan Cerdas', category: 'Pajak', progress: 0, image: 'https://placehold.co/600x338/2A2D3E/E0E0E0?text=Pajak+Cerdas', description: 'Pelajari cara merencanakan pajak Anda secara legal untuk meminimalkan beban pajak dan mengoptimalkan keuntungan.' },
        { id: 'analisis-laporan', title: 'Analisis Laporan Keuangan', category: 'Akuntansi', progress: 20, image: 'https://placehold.co/600x338/2A2D3E/E0E0E0?text=Analisis+Laporan', description: 'Belajar membaca neraca, laporan laba rugi, dan arus kas untuk membuat keputusan bisnis yang lebih baik.' },
        { id: 'branding', title: 'Branding untuk Usaha Kecil', category: 'Pemasaran', progress: 0, image: 'https://placehold.co/600x338/2A2D3E/E0E0E0?text=Branding+UMKM', description: 'Bangun identitas merek yang kuat dan berkesan agar produk Anda lebih menonjol di pasar.' }
    ];

    const allArticles = [
        { title: '5 Strategi Jitu Mengoptimalkan Arus Kas untuk Usaha Anda', category: 'Manajemen Kas', author: 'Tim PocketProfit', date: '15 Juni 2025', image: 'https://placehold.co/600x400/2A2D3E/E0E0E0?text=Manajemen+Kas', description: 'Pelajari cara mengelola arus kas masuk dan keluar secara efektif untuk menjaga kesehatan finansial bisnis Anda, bahkan di saat yang tidak menentu.' },
        { title: 'Panduan Lengkap Pajak untuk UMKM: PPh Final 0.5%', category: 'Pajak UMKM', author: 'Ahli Pajak', date: '12 Juni 2025', image: 'https://placehold.co/600x400/2A2D3E/E0E0E0?text=Pajak+UMKM', description: 'Memahami kewajiban pajak seringkali membingungkan. Artikel ini menyederhanakan konsep PPh Final dan bagaimana Anda bisa memanfaatkannya.' },
        { title: 'Meningkatkan Penjualan dengan Anggaran Terbatas via Media Sosial', category: 'Pemasaran Digital', author: 'Digital Marketer', date: '10 Juni 2025', image: 'https://placehold.co/600x400/2A2D3E/E0E0E0?text=Pemasaran+Digital', description: 'Tidak punya budget iklan besar? Tidak masalah. Temukan cara kreatif dan efektif untuk memasarkan produk Anda secara organik di platform media sosial.' },
        { title: 'Teknik FIFO, LIFO, dan Average: Mana yang Tepat untuk Usaha Anda?', category: 'Manajemen Stok', author: 'Ahli Akuntansi', date: '8 Juni 2025', image: 'https://placehold.co/600x400/2A2D3E/E0E0E0?text=Manajemen+Stok', description: 'Pemilihan metode penilaian persediaan yang tepat dapat berdampak besar pada laporan laba rugi dan neraca Anda. Pahami perbedaannya di sini.' }
    ];

    const courseSearchInput = document.getElementById('courseSearchInput');
    const courseCategoryFilter = document.getElementById('courseCategoryFilter');
    const courseListContainer = document.getElementById('courseListContainer');

    if (courseListContainer) {
        const renderCourses = (filter = '', category = 'semua') => {
            courseListContainer.innerHTML = '';
            const filteredCourses = allCourses.filter(course => {
                const matchesFilter = course.title.toLowerCase().includes(filter.toLowerCase());
                const matchesCategory = category === 'semua' || course.category.toLowerCase() === category.toLowerCase();
                return matchesFilter && matchesCategory;
            });

            if (filteredCourses.length === 0) {
                courseListContainer.innerHTML = '<p class="col-span-3 text-center text-custom-text-secondary">Kursus tidak ditemukan.</p>';
                return;
            }

            filteredCourses.forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = 'bg-custom-dashboard rounded-xl shadow-lg overflow-hidden flex flex-col';
                const buttonText = course.progress > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar';
                courseCard.innerHTML = `
                    <img src="${course.image}" alt="Gambar Kursus ${course.title}" class="w-full course-card-image h-48 object-cover">
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-md font-semibold text-custom-text-primary mb-1">${course.title}</h3>
                        <p class="text-xs text-custom-green bg-custom-green/10 inline-block px-2 py-0.5 rounded-full mb-2 self-start">${course.category}</p>
                        <p class="text-xs text-custom-text-secondary mb-3 flex-grow">${course.description}</p>
                        <div class="mb-2">
                            <p class="text-xs text-custom-text-secondary">Progress: ${course.progress}%</p>
                            <div class="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                                <div class="bg-custom-green h-1.5 rounded-full" style="width: ${course.progress}%;"></div>
                            </div>
                        </div>
                        <a href="course-detail.html?courseId=${course.id}" class="block mt-auto w-full bg-custom-green text-custom-bg text-sm font-medium py-2 px-4 rounded-lg hover:bg-custom-green-hover text-center">${buttonText}</a>
                    </div>
                `;
                courseListContainer.appendChild(courseCard);
            });
        };

        const updateCourseView = () => {
            const filterValue = courseSearchInput.value;
            const categoryValue = courseCategoryFilter.value;
            renderCourses(filterValue, categoryValue);
        };

        courseSearchInput.addEventListener('input', updateCourseView);
        courseCategoryFilter.addEventListener('change', updateCourseView);
        renderCourses();
    }

    const articleSearchInput = document.getElementById('articleSearchInput');
    const articleListContainer = document.getElementById('articleListContainer');

    if (articleListContainer) {
        const renderArticles = (filter = '') => {
            articleListContainer.innerHTML = '';
            const filteredArticles = allArticles.filter(article => article.title.toLowerCase().includes(filter.toLowerCase()));

            if (filteredArticles.length === 0) {
                articleListContainer.innerHTML = '<p class="md:col-span-2 text-center text-custom-text-secondary">Artikel tidak ditemukan.</p>';
                return;
            }

            filteredArticles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'bg-custom-dashboard rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300';
                articleCard.innerHTML = `
                    <img src="${article.image}" alt="Gambar Artikel ${article.title}" class="w-full h-48 object-cover">
                    <div class="p-6 flex flex-col flex-grow">
                        <div>
                            <p class="text-xs text-custom-green bg-custom-green/10 inline-block px-2 py-0.5 rounded-full mb-3">${article.category}</p>
                            <a href="#" class="block text-xl font-semibold text-custom-text-primary mb-2 hover:text-custom-green transition-colors duration-200">${article.title}</a>
                            <p class="text-custom-text-secondary text-sm mb-4">${article.description}</p>
                        </div>
                        <div class="flex items-center text-xs text-custom-text-secondary mt-auto pt-4 border-t border-gray-700/50">
                            <span>Oleh: ${article.author}</span>
                            <span class="mx-2">•</span>
                            <span>${article.date}</span>
                        </div>
                    </div>
                `;
                articleListContainer.appendChild(articleCard);
            });
        };

        articleSearchInput.addEventListener('input', () => {
            renderArticles(articleSearchInput.value);
        });

        renderArticles();
    }
});
