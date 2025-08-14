import React from 'react';

const HoroscopeCard = ({ horoscope, isSingle, circleProps }) => {
  if (!horoscope) return null;

  return (
    <div className={isSingle ? "result" : "card"} 
      style={{
        background: isSingle 
          ? 'linear-gradient(135deg, #4A3267, #C6BADE), #1f2937' 
          : 'linear-gradient(135deg, #4A3267, #000000), #1f2937',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        marginTop: isSingle ? '15px' : '0'
      }}
    >
      <h2 className="card-title">
        {isSingle ? `${horoscope.sign} - ${horoscope.date}` : horoscope.sign}
      </h2>
      
      {isSingle ? (
        <>
          <p>{horoscope.text}</p>
          <div className="stats">
            ❤️ Aşk: {horoscope.love}%<br />
            💰 Para: {horoscope.money}%<br />
            💪 Sağlık: {horoscope.health}%
          </div>
        </>
      ) : (
        <>
          <div className="circular-stats">
            <div className="circle love">
              <svg>
                <circle {...circleProps}></circle>
                <circle
                  {...circleProps}
                  style={{ '--percent': horoscope.love }}
                ></circle>
              </svg>
              <div className="label">❤️ {horoscope.love}%</div>
            </div>
            <div className="circle money">
              <svg>
                <circle {...circleProps}></circle>
                <circle
                  {...circleProps}
                  style={{ '--percent': horoscope.money }}
                ></circle>
              </svg>
              <div className="label">💰 {horoscope.money}%</div>
            </div>
            <div className="circle health">
              <svg>
                <circle {...circleProps}></circle>
                <circle
                  {...circleProps}
                  style={{ '--percent': horoscope.health }}
                ></circle>
              </svg>
              <div className="label">💪 {horoscope.health}%</div>
            </div>
          </div>
          <p>{horoscope.text}</p>
        </>
      )}
    </div>
  );
};

export default HoroscopeCard;