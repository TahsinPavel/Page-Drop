import React, { useState, useEffect, useRef, useCallback } from 'react';

const products = [
  {
    id: 1,
    title: "Aura Max",
    badge: "Flagship",
    desc: "Over-ear spatial audio headphones with active noise cancellation.",
    price: "$549.00",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600&h=600"
  },
  {
    id: 2,
    title: "Aura Pods Pro",
    badge: "Best Seller",
    desc: "In-ear precision monitors with adaptive transparency mode.",
    price: "$249.00",
    image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&q=80&w=600&h=600"
  },
  {
    id: 3,
    title: "Chronos Watch",
    badge: "Titanium",
    desc: "Aerospace-grade titanium chassis with sapphire crystal display.",
    price: "$799.00",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600&h=600"
  },
  {
    id: 4,
    title: "Vision Camera",
    badge: "Creator",
    desc: "Mirrorless full-frame sensor inside a minimalist milled block.",
    price: "$1,299.00",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600&h=600"
  },
  {
    id: 5,
    title: "Noir Essence",
    badge: "Limited",
    desc: "Signature scent enclosed in a machined glass and steel bottle.",
    price: "$180.00",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600&h=600"
  }
];

const App = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedProduct, setDisplayedProduct] = useState(products[0]);
  const [infoFade, setInfoFade] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const carouselRef = useRef(null);
  const stageRef = useRef(null);
  const currentRotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const activeIndexRef = useRef(0);
  const animFrameRef = useRef(null);

  const numItems = products.length;
  const theta = 360 / numItems;
  const itemWidth = 220;
  const radius = Math.round((itemWidth / 2) / Math.tan(Math.PI / numItems)) + 40;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * { box-sizing: border-box; margin: 0; padding: 0; -webkit-user-drag: none; }
      body { overflow-x: hidden; }
      .aura-body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background-color: #3d463d;
        min-height: 100vh;
        color: #2c2c2a;
        background-image: 
          radial-gradient(circle at 50% 120%, #f5f0e9 0%, #e0d1c1 20%, transparent 60%),
          radial-gradient(circle at 50% 80%, #9ba08b 0%, transparent 60%),
          linear-gradient(180deg, #3d463d 0%, #5b6352 40%, #9ba08b 80%, #e0d1c1 100%);
        background-attachment: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        -webkit-font-smoothing: antialiased;
        position: relative;
      }
      .aura-body::before {
        content: '';
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: 
          radial-gradient(circle at 15% 30%, rgba(142, 151, 117, 0.1) 0%, transparent 40%),
          radial-gradient(circle at 85% 70%, rgba(224, 209, 193, 0.1) 0%, transparent 40%);
        pointer-events: none;
        z-index: 0;
      }
      .aura-nav {
        position: fixed;
        top: 24px;
        width: 90%;
        max-width: 1200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 24px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 100px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 100;
      }
      .aura-logo {
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 2px;
        color: #f5f0e9;
      }
      .aura-cart-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        border-radius: 50%;
        width: 36px; height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: inset 0 2px 4px rgba(255,255,255,0.4);
        position: relative;
      }
      .aura-main {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 1400px;
        padding: 100px 20px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 60px;
      }
      .aura-hero-title {
        text-align: center;
        color: #f5f0e9;
        margin-bottom: -20px;
        opacity: 0.95;
        text-shadow: 0 4px 12px rgba(61, 70, 61, 0.3);
      }
      .aura-hero-title h1 {
        font-size: 48px;
        font-weight: 600;
        letter-spacing: -1px;
        margin-bottom: 8px;
      }
      .aura-hero-title p {
        font-size: 16px;
        font-weight: 300;
        opacity: 0.8;
      }
      .aura-stage {
        width: 100%;
        max-width: 900px;
        height: 460px;
        background: rgba(250, 249, 246, 0.75);
        backdrop-filter: blur(40px) saturate(110%);
        -webkit-backdrop-filter: blur(40px) saturate(110%);
        border-radius: 64px;
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: inset 0 8px 16px rgba(255, 255, 255, 1), inset 0 -8px 16px rgba(0, 0, 0, 0.02), 0 30px 60px -10px rgba(61, 70, 61, 0.25), 0 10px 20px -5px rgba(91, 99, 82, 0.15);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        user-select: none;
      }
      .aura-stage.grabbing {
        transform: scale(0.99);
      }
      .aura-stage::before {
        content: '';
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 60%; height: 60%;
        background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
        pointer-events: none;
      }
      .aura-scene {
        width: 100%;
        height: 100%;
        perspective: 1200px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        transform: translateX(-15%);
      }
      .aura-carousel {
        width: 220px;
        height: 280px;
        position: relative;
        transform-style: preserve-3d;
      }
      .aura-carousel-item {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #FFFFFF;
        border-radius: 32px;
        box-shadow: 
          0 15px 35px rgba(0,0,0,0.06), 
          inset 0 0 0 1px rgba(0,0,0,0.01),
          inset 0 4px 10px rgba(255,255,255,0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 16px;
        transition: opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease;
        opacity: 0.4;
        filter: blur(2px);
      }
      .aura-carousel-item.active {
        opacity: 1;
        filter: blur(0px);
        box-shadow: 
          0 20px 40px rgba(61, 70, 61, 0.12), 
          0 0 40px rgba(255, 255, 255, 0.7),
          inset 0 0 0 1px rgba(0,0,0,0.01),
          inset 0 4px 10px rgba(255,255,255,1);
      }
      .aura-carousel-item img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: grayscale(10%) contrast(90%) brightness(105%) drop-shadow(0 10px 15px rgba(0,0,0,0.1));
        pointer-events: none;
        transition: transform 0.4s ease;
        -webkit-user-drag: none;
        user-select: none;
      }
      .aura-carousel-item.active img {
        transform: scale(1.1) translateY(-5px);
      }
      .aura-info-panel {
        position: absolute;
        right: 40px;
        width: 280px;
        height: calc(100% - 80px);
        background: rgba(255, 255, 255, 0.5);
        border-radius: 40px;
        padding: 32px 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: inset 0 4px 12px rgba(255,255,255,0.8);
        border: 1px solid rgba(255,255,255,0.4);
        pointer-events: auto;
        z-index: 10;
      }
      .aura-info-content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      .aura-info-content.fade {
        opacity: 0;
        transform: translateY(10px);
      }
      .aura-product-badge {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #616e4b;
        background: rgba(142, 151, 117, 0.15);
        padding: 4px 10px;
        border-radius: 10px;
        align-self: flex-start;
        margin-bottom: 4px;
      }
      .aura-product-title {
        font-size: 24px;
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: -0.5px;
        color: #3d463d;
      }
      .aura-product-desc {
        font-size: 13px;
        color: #6b6b64;
        line-height: 1.4;
        font-weight: 400;
        margin-bottom: 8px;
      }
      .aura-product-price {
        font-size: 28px;
        font-weight: 300;
        color: #3d463d;
        letter-spacing: -1px;
        margin-bottom: 20px;
      }
      .aura-btn-buy {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #faf9f6;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: flex-end;
        margin-top: auto;
        box-shadow: -4px -4px 10px rgba(255,255,255,1), 4px 4px 10px rgba(0,0,0,0.05), inset 1px 1px 2px rgba(255,255,255,0.8);
        transition: all 0.2s ease;
        position: relative;
        font-size: 24px;
        font-weight: 300;
        color: #9ba08b;
        line-height: 1;
      }
      .aura-btn-buy:active {
        box-shadow: inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,1);
        transform: scale(0.95);
        color: #3d463d;
      }
      .aura-btn-buy-tooltip {
        position: absolute;
        top: -36px;
        background: #5b6352;
        color: #f5f0e9;
        font-size: 11px;
        padding: 6px 10px;
        border-radius: 8px;
        opacity: 0;
        transform: translateY(5px);
        transition: all 0.2s ease;
        pointer-events: none;
        white-space: nowrap;
        font-family: 'Inter', sans-serif;
      }
      .aura-btn-buy:hover .aura-btn-buy-tooltip {
        opacity: 1;
        transform: translateY(0);
      }
      .aura-features {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        width: 100%;
        max-width: 900px;
        margin-top: 20px;
      }
      .aura-feature-card {
        background: rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        padding: 24px;
        border-radius: 24px;
        color: #f5f0e9;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .aura-feature-icon {
        width: 40px; height: 40px;
        background: rgba(255,255,255,0.15);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 2px 5px rgba(255,255,255,0.2);
      }
      .aura-feature-card h3 { font-size: 15px; font-weight: 600; }
      .aura-feature-card p { font-size: 13px; font-weight: 300; opacity: 0.85; line-height: 1.4; }
      .aura-drag-hint {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(61, 70, 61, 0.4);
        font-size: 12px;
        font-weight: 500;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
      }
      .aura-stage:hover .aura-drag-hint { opacity: 1; }
      .aura-stage.grabbing .aura-drag-hint { opacity: 0 !important; }
      .cart-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: #8e9775;
        color: white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        font-size: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
      }
      @media (max-width: 960px) {
        .aura-scene { transform: translateX(0); height: 60%; align-items: flex-start; margin-top: 40px; }
        .aura-stage { height: 600px; flex-direction: column; border-radius: 48px; }
        .aura-info-panel { 
          position: relative; right: auto; bottom: 0; 
          width: calc(100% - 40px); height: auto; 
          margin-bottom: 20px; border-radius: 32px;
          padding: 24px;
          background: rgba(255,255,255,0.6);
        }
        .aura-features { grid-template-columns: 1fr; }
      }
      @media (max-width: 500px) {
        .aura-hero-title h1 { font-size: 36px; }
        .aura-stage { height: 550px; border-radius: 40px; }
        .aura-info-panel { padding: 20px; width: calc(100% - 30px); margin-bottom: 15px; }
        .aura-product-title { font-size: 20px; }
        .aura-product-price { font-size: 24px; }
      }
    `;
    document.head.appendChild(style);

    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link2);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const updateInfoPanel = useCallback((index) => {
    setInfoFade(true);
    setTimeout(() => {
      setDisplayedProduct(products[index]);
      setInfoFade(false);
    }, 300);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const animate = () => {
      currentRotationRef.current += (targetRotationRef.current - currentRotationRef.current) * 0.1;
      carousel.style.transform = `translateZ(${-radius}px) rotateY(${currentRotationRef.current}deg)`;

      let normalizedRotation = currentRotationRef.current % 360;
      if (normalizedRotation > 0) normalizedRotation -= 360;
      let closestIndex = Math.round(Math.abs(normalizedRotation) / theta) % numItems;
      if (currentRotationRef.current > 0) {
        closestIndex = (numItems - closestIndex) % numItems;
      }

      if (closestIndex !== activeIndexRef.current) {
        activeIndexRef.current = closestIndex;
        setActiveIndex(closestIndex);
        updateInfoPanel(closestIndex);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    carousel.style.transform = `translateZ(${-radius}px) rotateY(0deg)`;
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [radius, theta, numItems, updateInfoPanel]);

  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.pageX;
    velocityRef.current = 0;
    setIsGrabbing(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.pageX - lastXRef.current;
    lastXRef.current = e.pageX;
    targetRotationRef.current += deltaX * 0.4;
    velocityRef.current = deltaX;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsGrabbing(false);
    targetRotationRef.current += velocityRef.current * 5;
    const snapAngle = Math.round(targetRotationRef.current / theta) * theta;
    targetRotationRef.current = snapAngle;
  }, [theta]);

  const handleTouchStart = useCallback((e) => {
    isDraggingRef.current = true;
    lastXRef.current = e.touches[0].pageX;
    velocityRef.current = 0;
    setIsGrabbing(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].pageX - lastXRef.current;
    lastXRef.current = e.touches[0].pageX;
    targetRotationRef.current += deltaX * 0.4;
    velocityRef.current = deltaX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsGrabbing(false);
    targetRotationRef.current += velocityRef.current * 5;
    const snapAngle = Math.round(targetRotationRef.current / theta) * theta;
    targetRotationRef.current = snapAngle;
  }, [theta]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="aura-body">
      <nav className="aura-nav">
        <div className="aura-logo">AURA</div>
        <button className="aura-cart-btn" aria-label="Cart" style={{ position: 'relative' }}>
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: '#f5f0e9', width: 16, height: 16, fill: 'none', strokeWidth: 1.5 }}>
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </nav>

      <main className="aura-main">
        <div className="aura-hero-title">
          <h1>Curated Essentials</h1>
          <p>Drag to explore the collection</p>
        </div>

        <section
          ref={stageRef}
          className={`aura-stage${isGrabbing ? ' grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="aura-scene">
            <div className="aura-carousel" ref={carouselRef}>
              {products.map((prod, i) => {
                const rotation = i * theta;
                return (
                  <div
                    key={prod.id}
                    className={`aura-carousel-item${activeIndex === i ? ' active' : ''}`}
                    style={{ transform: `rotateY(${rotation}deg) translateZ(${radius}px)` }}
                  >
                    <img src={prod.image} alt={prod.title} draggable="false" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="aura-info-panel">
            <div className={`aura-info-content${infoFade ? ' fade' : ''}`}>
              <span className="aura-product-badge">{displayedProduct.badge}</span>
              <h2 className="aura-product-title">{displayedProduct.title}</h2>
              <p className="aura-product-desc">{displayedProduct.desc}</p>
              <div className="aura-product-price">{displayedProduct.price}</div>
            </div>
            <button className="aura-btn-buy" aria-label="Add to cart" onClick={handleAddToCart}>
              <span className="aura-btn-buy-tooltip">Add to Cart</span>
              +
            </button>
          </div>

          <div className="aura-drag-hint">
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 1.5 }}>
              <path d="M8 9l4-4 4 4M16 15l-4 4-4-4"></path>
            </svg>
            Drag to rotate
          </div>
        </section>

        <section className="aura-features">
          <div className="aura-feature-card">
            <div className="aura-feature-icon">
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: '#f5f0e9', fill: 'none', strokeWidth: 1.5 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Precision Engineered</h3>
            <p>Every detail meticulously crafted for unparalleled acoustic performance.</p>
          </div>
          <div className="aura-feature-card">
            <div className="aura-feature-icon">
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: '#f5f0e9', fill: 'none', strokeWidth: 1.5 }}>
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <h3>Premium Materials</h3>
            <p>Anodized aluminum, memory foam, and custom acoustic mesh.</p>
          </div>
          <div className="aura-feature-card">
            <div className="aura-feature-icon">
              <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: '#f5f0e9', fill: 'none', strokeWidth: 1.5 }}>
                <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
                <circle cx="16" cy="12" r="3"></circle>
              </svg>
            </div>
            <h3>Seamless Spatial</h3>
            <p>Connects instantly. Adapts magically to your environment.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;