const buttons = document.querySelectorAll('.toggle-bar button');
// const snippet_panel = document.getElementById('snippet-panel');
const preview_img = document.getElementById('preview-img');

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