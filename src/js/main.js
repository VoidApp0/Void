class VoidDownload {
    constructor() {
        this.apiUrl = 'https://api.github.com/';
        this.versionElement = document.getElementById('version');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.downloadWrap = document.getElementById('downloadWrap');

        this.init();
    }

    async init() {
        try {
            await this.loadLatestRelease();
        } catch (error) {
            this.handleError(error);
        }
    }

    async loadLatestRelease() {
        this.setLoading(true);

        try {
            // Simular carregamento por 1 segundo para mostrar a animação
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response = await fetch(this.apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const release = await response.json();
            this.updateUI(release);

        } catch (error) {
            // Fallback - simular dados quando a API não estiver disponível
            this.simulateFallback();
            throw error;
        } finally {
            this.setLoading(false);
        }
    }

    updateUI(release) {
        const { tag_name, assets } = release;
        const apkAsset = assets.find(asset => asset.name.endsWith('.apk'));

        // Atualizar versão
        this.versionElement.textContent = `Versão ${tag_name}`;
        this.versionElement.classList.add('success');

        if (apkAsset) {
            // Configurar botão de download
            this.downloadBtn.href = apkAsset.browser_download_url;
            this.downloadBtn.setAttribute('aria-disabled', 'false');
            this.downloadBtn.removeAttribute('disabled');
            this.downloadBtn.style.cursor = 'pointer';

            // Adicionar evento de clique para analytics/tracking
            this.downloadBtn.addEventListener('click', () => {
                this.trackDownload(tag_name);
            });

            this.showSuccess();
        } else {
            this.showNoApkFound();
        }
    }

    simulateFallback() {
        // Simular dados quando não há API disponível
        this.versionElement.textContent = 'Versão não disponível';
        this.versionElement.style.color = 'var(--text-muted)';

        this.downloadBtn.setAttribute('aria-disabled', 'true');
        this.downloadBtn.style.opacity = '0.6';
        this.downloadBtn.style.cursor = 'not-allowed';
    }

    showSuccess() {
        this.downloadWrap.style.animation = 'pulse 0.6s ease-out';

        // Adicionar efeito visual de sucesso
        setTimeout(() => {
            this.downloadWrap.style.animation = '';
        }, 600);
    }

    showNoApkFound() {
        this.versionElement.textContent += ' (APK não encontrado)';
        this.downloadBtn.setAttribute('aria-disabled', 'true');
        this.downloadBtn.style.opacity = '0.6';
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.versionElement.classList.add('loading');
        } else {
            this.versionElement.classList.remove('loading');
        }
    }

    handleError(error) {
        console.warn('Erro ao carregar release:', error.message);
        this.versionElement.textContent = 'Erro ao carregar versão';
        this.versionElement.style.color = '#ef4444';
    }

    trackDownload(version) {
        // Aqui você pode adicionar tracking/analytics
        console.log(`Download iniciado - Versão: ${version}`);

        // Exemplo de integração com Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                event_category: 'APK',
                event_label: version,
                value: 1
            });
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new VoidDownload();

    // Adicionar efeitos visuais extras
    addVisualEffects();
});

function addVisualEffects() {
    // Efeito de parallax sutil no header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.site-header');
        header.style.transform = `translateY(${scrolled * 0.1}px)`;
    });

    // Animação de hover nos elementos interativos
    const interactiveElements = document.querySelectorAll('.btn, .brand');

    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
        });

        element.addEventListener('mouseleave', function () {
            if (!this.matches('.download-btn:hover')) {
                this.style.transform = '';
            }
        });
    });

    // Efeito de typing no tagline
    const tagline = document.querySelector('.tagline');
    const originalText = tagline.textContent;

    // Efeito sutil de fade-in nos elementos da página
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animação de fade-in a elementos relevantes
    const animatedElements = document.querySelectorAll('.card-right > *');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Adicionar funcionalidade de detecção de dispositivo
function detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const downloadBtn = document.getElementById('downloadBtn');

    if (userAgent.includes('android')) {
        downloadBtn.innerHTML = 'Baixar para Android 📱';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        downloadBtn.innerHTML = 'Disponível apenas para Android 📱';
        downloadBtn.setAttribute('aria-disabled', 'true');
        downloadBtn.style.opacity = '0.6';
        downloadBtn.style.cursor = 'not-allowed';
    }
}

// Executar detecção de dispositivo
document.addEventListener('DOMContentLoaded', detectDevice);
