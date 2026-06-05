const buttons = document.querySelectorAll('.toggle-bar button');
// const snippet_panel = document.getElementById('snippet-panel');
const preview_img = document.getElementById('preview-img');
const preview_box = document.querySelector('.preview-box');
const selections = {};

function render_preview()
{
    preview_box.querySelectorAll('img').forEach(img => img.remove());

    const layerOrder = 
    [
        'Background', 
        'Character', 
        'Shirts', 
        'Eyes', 
        'Mouth', 
        'Cheeks', 
        'Ears', 
        'Extra'];

    layerOrder.forEach(layer =>
    {
        if (selections[layer])
        {
            const img = document.createElement('img');
            img.src = selections[layer];
            img.style.position = 'absolute';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
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
        document.querySelectorAll('.snippet-grid img').forEach(i => i.classList.remove('selected'));
        img.classList.add('selected');

        preview_img.src = img.src;
        preview_img.classList.add('visible');
    });
});

showTab('Background');