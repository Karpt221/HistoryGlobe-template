    // Об'єкт з історіями країн  
    const countryHistories = {
        'Ukraine': `  
            <p><strong>Україна</strong> - одна з найбільших країн Європи з багатою історією та культурою.</p>  
            <p>Історія України охоплює період від появи перших поселень на її території у кам'яну добу до сьогодення.   
            Серед ключових періодів:</p>  
            <ul>  
                <li>Київська Русь (IX-XIII ст.) - одна з наймогутніших держав середньовічної Європи</li>  
                <li>Козацька доба (XV-XVIII ст.) - період формування української національної ідентичності</li>  
                <li>Українська Народна Республіка (1917-1921) - важливий етап державотворення</li>  
                <li>Незалежність України (з 1991) - сучасний період розвитку української державності</li>  
            </ul>  
        `,
        'Mordor': `  
            <p>Територія, де панує темрява та зло. Відома своїми недружніми діями щодо сусідів та постійними спробами захопити чужі території.</p>  
            <p>Основні "досягнення":</p>  
            <ul>  
                <li>Постійні спроби захоплення чужих територій</li>  
                <li>Пропаганда та дезінформація</li>  
                <li>Порушення міжнародного права</li>  
            </ul>  
        `,
        'Poland': `  
            <p><strong>Польща</strong> - країна з багатою історією та культурною спадщиною.</p>  
            <p>Ключові історичні періоди:</p>  
            <ul>  
                <li>Формування польської державності (X ст.)</li>  
                <li>Річ Посполита (XVI-XVIII ст.)</li>  
                <li>Поділи Польщі та боротьба за незалежність</li>  
                <li>Сучасна демократична держава</li>  
            </ul>  
        `
    };

    // Функції для роботи з модальним вікном  
    export function openModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-content').innerHTML = content;
        document.querySelector('.modal-overlay').style.display = 'block';
        document.querySelector('.country-modal').style.display = 'block';
    }

    function closeModal() {
        document.querySelector('.modal-overlay').style.display = 'none';
        document.querySelector('.country-modal').style.display = 'none';
    }
    // Додавання обробників подій для закриття модального вікна  
    document.querySelector('.modal-close').onclick = closeModal;
    document.querySelector('.modal-overlay').onclick = closeModal;
