const buttons = document.querySelectorAll('.toggle-bar button');
const preview_box = document.getElementById('preview-box');
const info_btn = document.getElementById('info-btn');
const fullview_close = document.getElementById('fullview-close');
const toggle_wrapper = document.querySelector('.toggle-wrapper');
const snippet_panel = document.getElementById('snippet-panel');
const selections = {};
selections["Extra"] = [];

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

const random_blocklist = 
{
    'Background': [],
    'Character':  ['empty.png'],
    'Shirts':     ['empty.png'],
    'Eyes':       ['empty.png'],
    'Head ons':   ['empty.png'],
    'Mouth':      [],
    'Cheeks':     [],
    'Extra':      ['empty.png']
};

function render_preview()
{
    preview_box.querySelectorAll('img').forEach(img => img.remove());

    layerOrder.forEach(layer =>
    {
        if (layer === 'Extra')
        {
            (selections.Extra || []).forEach(src =>
            {
                const img = document.createElement('img');
                img.src = src;
                img.style.position = 'absolute';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'contain';
                preview_box.appendChild(img);
            });
            return;
        }

        if (selections[layer])
        {
            const img = document.createElement('img');
            img.src = selections[layer];
            img.style.position = 'absolute';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = layer === 'Background' ? 'cover' : 'contain';
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
        const activeTab =
            document.querySelector('.toggle-bar button.active').textContent;

        if (activeTab === 'Extra')
        {
            if (!selections.Extra) selections.Extra = [];
            if (img.classList.contains('selected'))
            {
                img.classList.remove('selected');
                selections.Extra = selections.Extra.filter(src => src !== img.src);
            }
            else
            {
                img.classList.add('selected');
                selections.Extra.push(img.src);
            }
            render_preview();
            return;
        }
        document.querySelectorAll
        (`.snippet-grid[data-tab="${activeTab}"] img`).forEach(i => i.classList.remove('selected'));

        if (img.src.includes('empty.png'))
        {
            delete selections[activeTab];
            render_preview();
            return;
        }

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

document.getElementById('save-btn').addEventListener('click', () =>
{
    const canvas = document.createElement('canvas');
    canvas.width = preview_box.offsetWidth;
    canvas.height = preview_box.offsetHeight;
    const ctx = canvas.getContext('2d');

    const orderedSrcs = [];
    layerOrder.forEach(layer =>
    {
        if (layer === 'Extra')
        {
            (selections.Extra || []).forEach(src =>
            {
                orderedSrcs.push({ src, isBg: false });
            });
            return;
        }
        if (selections[layer])        {
            orderedSrcs.push({ src: selections[layer], isBg: layer === 'Background' });
        }
    });
        // .filter(layer => selections[layer])
        // .map(layer => ({ src: selections[layer], isBg: layer === 'Background' }));

    if (orderedSrcs.length === 0)
    {
        alert('No layers selected yet');
        return;
    }

    let index = 0;

    function drawNext()
    {
        if (index >= orderedSrcs.length)
        {
            const link = document.createElement('a');
            link.download = 'pfp.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            return;
        }

        const { src, isBg } = orderedSrcs[index];
        const tempImg = new Image();
        tempImg.src = src;
        tempImg.onload = () =>
        {
            if (isBg)
            {
                ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
            }
            else
            {
                const size = Math.min(canvas.width, canvas.height);
                const x = (canvas.width - size) / 2;
                const y = (canvas.height - size) / 2;
                ctx.drawImage(tempImg, x, y, size, size);
            }
            index++;
            drawNext();
        };
        tempImg.onerror = () =>
        {
            index++;
            drawNext();
        };
    }

    drawNext();
});    

document.getElementById('random-btn').addEventListener('click', () =>
{
    document.querySelectorAll('.snippet-grid img').forEach(i => i.classList.remove('selected'));

    layerOrder.forEach(layer =>
    {
        const grid = document.querySelector(`.snippet-grid[data-tab="${layer}"]`);
        if (!grid) return;
        const blocked = random_blocklist[layer] || [];
        const images = Array.from(grid.querySelectorAll('img'))
        .filter(img => !blocked.some(b => img.src.includes(b)));
        if (images.length === 0) return;
        if (layer === 'Extra')
        {
            const random_img = images[Math.floor(Math.random() * images.length)];
            random_img.classList.add('selected');
            selections.Extra = [random_img.src];
            return;
        }
        const random_img = images[Math.floor(Math.random() * images.length)];
        random_img.classList.add('selected');
        selections[layer] = random_img.src;
    });

    render_preview();
});