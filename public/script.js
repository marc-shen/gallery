const galleryElement = document.getElementById('gallery');
const columns = 3;
const columnElements = [];

// 创建列元素
for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.classList.add('column');
    columnElements.push(column);
    galleryElement.appendChild(column);
}

// 从服务器获取图片 URL 并逐一展示
fetch('/images')
    .then(response => response.json())
    .then(imageUrls => {
        let index = 0;

        function loadNextImage() {
            if (index < imageUrls.length) {
                const img = document.createElement('img');
                img.src = imageUrls[index];
                img.alt = `Photo ${index + 1}`;
                img.onclick = function() {
                    openModal(img.src, img.alt);
                };
                img.onload = () => {
                    columnElements[index % columns].appendChild(img);
                    index++;
                    loadNextImage();
                };
                img.onerror = () => {
                    console.error(`Error loading image: ${imageUrls[index]}`);
                    index++;
                    loadNextImage();
                };
            }
        }

        loadNextImage();
    })
    .catch(error => console.error('Error loading images:', error));

// 模态窗口逻辑
const modal = document.getElementById('myModal');
const modalImg = document.getElementById('img01');
const captionText = document.getElementById('caption');
const exifInfo = document.getElementById('exif-info');
const span = document.getElementsByClassName('close')[0];

function openModal(src, alt) {
    modal.style.display = 'block';
    document.body.classList.add('no-scroll');
    modalImg.src = src;
    captionText.innerHTML = alt;
    exifInfo.innerHTML = ''; // Clear previous EXIF info

    // Fetch and display EXIF data
    modalImg.onload = function() {
        EXIF.getData(modalImg, function() {
            const aperture = EXIF.getTag(this, 'FNumber');
            const exposureTime = EXIF.getTag(this, 'ExposureTime');
            const iso = EXIF.getTag(this, 'ISOSpeedRatings');

            exifInfo.innerHTML = `
                <p>光圈: ${aperture ? `f/${aperture}` : 'N/A'}</p>
                <p>快门: ${exposureTime ? `${exposureTime}s` : 'N/A'}</p>
                <p>ISO: ${iso ? iso : 'N/A'}</p>
            `;
        });
    };
}

span.onclick = function() {
    closeModal();
}

modal.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

function closeModal() {
    modal.style.display = 'none';
    document.body.classList.remove('no-scroll');
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        themeToggle.textContent = 'brightness_7';
    } else {
        themeToggle.textContent = 'brightness_4';
    }
});