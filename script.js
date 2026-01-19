// ハンバーガーメニューのトグル
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// ナビゲーションメニューのリンクをクリックしたときにメニューを閉じる
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// スクロール時にナビゲーションバーに背景を追加
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// フォーム送信の処理
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('ありがとうございます！メッセージを受け取りました。');
        contactForm.reset();
    });
}

// アニメーション用のIntersection Observer
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

// アニメーション対象の要素を監視
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // すべての機能を初期化
    initCustomCursor();
    initParticles();
    initTypingAnimation();
    initCountUp();
    initParallax();
    initSteakSlider();
});

// ==================== カスタムカーソル ====================
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    if (!cursor || !follower) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // フォロワーのスムーズな追従
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // インタラクティブ要素でのホバー効果
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

// ==================== パーティクルアニメーション ====================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    
    // キャンバスサイズの設定
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // パーティクルクラス
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // マウスに反応
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    this.x -= (dx / distance) * force * 2;
                    this.y -= (dy / distance) * force * 2;
                }
            }
            
            // 境界処理
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            this.x = Math.max(0, Math.min(canvas.width, this.x));
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }
        
        draw() {
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // パーティクルの生成（80個）
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
    
    // マウス位置の追跡
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    document.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    // アニメーションループ
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // パーティクルの更新と描画
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // パーティクル間の線を描画
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    animate();
}

// ==================== タイピングアニメーション ====================
function initTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-text');
    if (typingElements.length === 0) return;
    
    // 要素を遅延時間でソート
    const elementsWithDelay = Array.from(typingElements).map((element, index) => {
        const text = element.getAttribute('data-text');
        const delay = parseInt(element.getAttribute('data-delay')) || (index * 1000);
        return { element, text, delay };
    }).sort((a, b) => a.delay - b.delay);
    
    elementsWithDelay.forEach(({ element, text, delay }) => {
        if (!text) return;
        
        element.textContent = '';
        
        setTimeout(() => {
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    // 最後のタイピングが終わったらカーソルを非表示とキラキラエフェクト
                    if (element === elementsWithDelay[elementsWithDelay.length - 1].element) {
                        setTimeout(() => {
                            const cursor = document.querySelector('.typing-cursor');
                            if (cursor) {
                                cursor.style.opacity = '0';
                            }
                            // キラキラエフェクトを開始
                            initSparkleEffect(element);
                        }, 1000);
                    }
                }
            }, 100);
        }, delay);
    });
}

// ==================== カウントアップアニメーション ====================
function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length === 0) return;
    
    function animateCount(element, start, end, suffix) {
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // イージング関数（easeOutCubic）
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeProgress);
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = end + suffix;
            }
        }
        
        requestAnimationFrame(update);
    }
    
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-target'));
                const suffix = entry.target.getAttribute('data-suffix') || '';
                animateCount(entry.target, 0, target, suffix);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        countObserver.observe(stat);
    });
}

// ==================== パララックス効果 ====================
function initParallax() {
    const parallaxElements = document.querySelectorAll('.image-placeholder, .hero-image');
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach((element, index) => {
                    const speed = 0.3 + (index * 0.1);
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ==================== キラキラエフェクト ====================
function initSparkleEffect(element) {
    if (!element) return;
    
    // 定期的にキラキラを生成
    const sparkleInterval = setInterval(() => {
        createSparkle(element);
    }, 200);
    
    // マウスホバー時にもキラキラを生成
    element.addEventListener('mouseenter', () => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createSparkle(element);
            }, i * 100);
        }
    });
    
    // クリック時にもキラキラを生成
    element.addEventListener('click', () => {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createSparkle(element);
            }, i * 50);
        }
    });
    
    // 初期のキラキラを生成
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createSparkle(element);
        }, i * 150);
    }
}

function createSparkle(element) {
    const rect = element.getBoundingClientRect();
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    // 要素のランダムな位置に配置
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    
    // ランダムな方向に飛ばす
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 60;
    const sparkleX = Math.cos(angle) * distance;
    const sparkleY = Math.sin(angle) * distance;
    
    // ランダムなサイズ
    const size = 4 + Math.random() * 4;
    sparkle.style.width = size + 'px';
    sparkle.style.height = size + 'px';
    
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.setProperty('--sparkle-x', sparkleX + 'px');
    sparkle.style.setProperty('--sparkle-y', sparkleY + 'px');
    
    // ランダムな色のキラキラ
    const colors = [
        'rgba(255, 255, 255, 1)',
        'rgba(99, 102, 241, 0.9)',
        'rgba(139, 92, 246, 0.9)',
        'rgba(236, 72, 153, 0.9)',
        'rgba(245, 158, 11, 0.9)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.background = `radial-gradient(circle, ${color} 0%, rgba(255, 255, 255, 0.8) 30%, transparent 70%)`;
    
    element.style.position = 'relative';
    element.appendChild(sparkle);
    
    // アニメーション終了後に削除
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 2000);
}

// ==================== ステーキスライダー ====================
function initSteakSlider() {
    const sliderTrack = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (!sliderTrack || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoSlideInterval;
    
    // スライドを表示する関数
    function showSlide(index) {
        // インデックスを範囲内に収める
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        // スライドを移動
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // アクティブクラスの更新
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentSlide);
        });
        
        // ドットの更新
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }
    
    // 次のスライドへ
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // 前のスライドへ
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // 自動スライド機能
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 5秒ごとに自動切り替え
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // ボタンイベント
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // ドットクリックイベント
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // マウスホバーで自動スライドを一時停止
    const slider = document.querySelector('.steak-slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }
    
    // タッチスワイプ対応（モバイル）
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (sliderTrack) {
        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        });
        
        sliderTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoSlide();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // 初期化
    showSlide(0);
    startAutoSlide();
}
