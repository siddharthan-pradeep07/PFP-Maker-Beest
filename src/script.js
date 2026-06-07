const buttons = document.querySelectorAll('.toggle-bar button');
const preview_box = document.querySelector('.preview-box');
const info_btn = document.getElementById('info-btn');
const fullview_close = document.getElementById('fullview-close');
const toggle_wrapper = document.querySelector('.toggle-wrapper');
const snippet_panel = document.getElementById('snippet-panel');
const selections = {};

const layerOrder = 
[
    'Background', 
    'Character', 
    'Shirts', 
    'Eyes', 
    'Head ons',
    'Mouth', 
    'Cheeks', 
    'Extra'
];

function render_preview()
{
    preview_box.querySelectorAll('img').forEach(img => img.remove());

    layerOrder.forEach(layer =>
    {
        if (selections[layer])
        {
            const img = document.createElement('img');
            img.src = selections[layer];
            img.style.position = 'absolute';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = layer === 'Background' ? 'cover' : 'contain';
            img.style.display = 'block';
            preview_box.appendChild(img);
        }
    });
}

function showTab(tabName)
{
    document.querySelectorAll('.snippet-grid').forEach(grid =>
    {
        grid.classList.toggle('active', grid.dataset.tab === tabName);
    });
}

buttons.forEach(btn =>
{
    btn.addEventListener('click', () =>
    {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showTab(btn.textContent);
    });
});

document.querySelectorAll('.snippet-grid img').forEach(img =>
{
    img.addEventListener('click', () =>
    {
        const activeTab = document.querySelector('.toggle-bar button.active').textContent;

        document.querySelectorAll(`.snippet-grid[data-tab="${activeTab}"] img`).forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');

        selections[activeTab] = img.src;
        render_preview();
    });
});

showTab('Background');

info_btn.addEventListener('click', () =>
{
    toggle_wrapper.style.display = 'none';
    snippet_panel.style.display = 'none';
    preview_box.style.display = 'none';
    fullview_close.classList.add('visible');
});

document.getElementById('fullview-close-btn').addEventListener('click', () =>
{
    toggle_wrapper.style.display = 'flex';
    snippet_panel.style.display = 'block';
    preview_box.style.display = 'block';
    fullview_close.classList.remove('visible');
});