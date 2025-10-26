import React from 'react';

export const ConfiguratorPage: React.FC = () => {
  return (
    <div className="configurator-page">
      <header className="configurator-header">
        <h1>Domio Конфигуратор Шкафов</h1>
      </header>
      <main className="configurator-main">
        <div className="configurator-sidebar">
          {/* Configuration options will be here */}
          <p>Настройки конфигуратора</p>
        </div>
        <div className="configurator-canvas">
          {/* Canvas rendering will be here */}
          <p>2D Canvas визуализация</p>
        </div>
      </main>
      <footer className="configurator-footer">
        <div className="price-display">
          <span>Итого: </span>
          <strong>0 ₽</strong>
        </div>
        <button className="add-to-cart-btn">Добавить в корзину</button>
      </footer>
    </div>
  );
};
