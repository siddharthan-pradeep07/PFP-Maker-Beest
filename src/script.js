const buttons = document.querySelectorAll('.toggle-bar button');
const preview_box = document.querySelector('.preview-box');
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