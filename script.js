// 获取当前日期并显示
document.addEventListener('DOMContentLoaded', () => {
    const currentDateElement = document.getElementById('currentDate');
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];
    currentDateElement.textContent = formattedDate;
});

// 弹出新建日记框
const addEntryButton = document.getElementById('addEntry');
const entryModal = document.getElementById('entryModal');
const closeModalButton = document.getElementById('closeModal');
const saveEntryButton = document.getElementById('saveEntry');
const entryText = document.getElementById('entryText');
const entryImage = document.getElementById('entryImage');
const entriesContainer = document.getElementById('entries');

addEntryButton.addEventListener('click', () => {
    entryModal.style.display = 'flex';
});

closeModalButton.addEventListener('click', () => {
    entryModal.style.display = 'none';
});

saveEntryButton.addEventListener('click', () => {
    const text = entryText.value;
    const imageFile = entryImage.files[0];
    const date = document.getElementById('currentDate').textContent;

    if (text) {
        const entryCard = document.createElement('div');
        entryCard.classList.add('entry-card');
        entryCard.innerHTML = `<p><strong>${date}</strong></p><p>${text}</p>`;

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                entryCard.appendChild(imgElement);
            };
            reader.readAsDataURL(imageFile);
        }

        entriesContainer.prepend(entryCard);
        entryText.value = '';
        entryImage.value = '';
        entryModal.style.display = 'none';
    }
});

let currentCategory = '';

// 显示二级页面
function showSecondPage(category) {
    currentCategory = category;
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('second-page').style.display = 'block';
    
    const titles = {
        wants: '我要的',
        tries: '我想试',
        hates: '我讨厌',
        likes: '我喜欢'
    };
    
    document.getElementById('second-page-title').textContent = titles[category];
    loadItems();
}

// 返回主页面
function showMainPage() {
    document.getElementById('second-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
    updatePreviews();
}

// 打开弹窗
function openModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    document.getElementById('item-input').value = '';
    document.getElementById('item-input').focus();
}

// 关闭弹窗
document.querySelector('.close').onclick = function() {
    document.getElementById('modal').style.display = 'none';
}

// 点击弹窗外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// 添加项目
function addItem() {
    const input = document.getElementById('item-input');
    const text = input.value.trim();
    
    if (text) {
        const items = getItems();
        items.push(text);
        saveItems(items);
        loadItems();
        document.getElementById('modal').style.display = 'none';
        updatePreviews();
    }
}

// 删除项目
function deleteItem(index) {
    const items = getItems();
    items.splice(index, 1);
    saveItems(items);
    loadItems();
    updatePreviews();
}

// 加载项目列表
function loadItems() {
    const items = getItems();
    const list = document.getElementById('items-list');
    list.innerHTML = '';
    
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item}</span>
            <button class="delete-btn" onclick="deleteItem(${index})">×</button>
        `;
        list.appendChild(li);
    });
}

// 更新主页面预览
function updatePreviews() {
    ['wants', 'tries', 'hates', 'likes'].forEach(category => {
        const items = JSON.parse(localStorage.getItem(category) || '[]');
        const preview = document.getElementById(`${category}-preview`);
        preview.innerHTML = '';
        
        // 只显示前3个项目
        items.slice(0, 3).forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            preview.appendChild(li);
        });
    });
}

// 获取当前分类的项目
function getItems() {
    return JSON.parse(localStorage.getItem(currentCategory) || '[]');
}

// 保存项目
function saveItems(items) {
    localStorage.setItem(currentCategory, JSON.stringify(items));
}

// 页面加载时更新预览
window.onload = updatePreviews;
