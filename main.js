/* 1. THEME */
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => document.body.classList.toggle('dark-mode'));

/* 2. SIDEBAR ACCORDION */
const navHeaders = document.querySelectorAll('.nav-header');
navHeaders.forEach(header => {
    header.addEventListener('click', () => {
        header.parentElement.classList.toggle('open');
    });
});
// Auto-open active link
const activeLink = document.querySelector('.nav-link.active');
if(activeLink) {
    let parent = activeLink.parentElement;
    while(parent && !parent.classList.contains('sidebar')) {
        if(parent.classList.contains('nav-item')) parent.classList.add('open');
        parent = parent.parentElement;
    }
}

/* 3. MOSFET CALCULATOR */
const inputVth = document.getElementById('input-vth');
const inputVgs = document.getElementById('input-vgs');
const inputVds = document.getElementById('input-vds');
const statusBox = document.getElementById('mosfet-status');
const explainText = document.getElementById('mosfet-explanation');

function updateMosfet() {
    const vth = parseFloat(inputVth.value);
    const vgs = parseFloat(inputVgs.value);
    const vds = parseFloat(inputVds.value);

    // Update labels
    document.getElementById('val-vth').innerText = vth.toFixed(1);
    document.getElementById('val-vgs').innerText = vgs.toFixed(1);
    document.getElementById('val-vds').innerText = vds.toFixed(1);

    let region = "", styleClass = "", desc = "";

    if (vgs < vth) {
        region = "CUTOFF";
        styleClass = "status-off";
        desc = "Gate voltage below threshold.";
    } else if (vds < (vgs - vth)) {
        region = "OHMIC (LINEAR)";
        styleClass = "status-ohmic";
        desc = "Acting like a resistor (Vds is small).";
    } else {
        region = "SATURATION";
        styleClass = "status-sat";
        desc = "Acting like a current source (Vds is high).";
    }

    statusBox.innerText = region;
    statusBox.className = `status-indicator ${styleClass}`;
    explainText.innerText = desc;
}

[inputVth, inputVgs, inputVds].forEach(el => el.addEventListener('input', updateMosfet));
updateMosfet();

/* 4. INTUITION TOGGLE */
const viewBtns = document.querySelectorAll('.view-btn');
viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        document.querySelector('.intuition-view').classList.toggle('hidden', view !== 'intuition');
        document.querySelector('.math-view').classList.toggle('hidden', view !== 'math');
    });
});