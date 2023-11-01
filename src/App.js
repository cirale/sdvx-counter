import React, { useEffect, useState } from 'react';

function Vol({ axes, type}) {
  const rad = ( axes + 1 ) * Math.PI;
  const style = {
    'transform': 'rotate(' + rad + 'rad)'
  }
  
  if (type === "L") {
    return <div className='vol vol-l' style={style}>|</div>
  } else {
    return <div className='vol vol-r' style={style}>|</div>
  }
}

function Button({ pressed, type }) {
  if (type === "BT"){
    const cl = (pressed) => { return pressed ? "bt-on" : "bt-off" };
    return <div className={"bt " + cl(pressed)}></div>;
  } else {
    const cl = (pressed) => { return pressed ? "fx-on" : "fx-off" };
    return <div className={"fx " + cl(pressed)}></div>;
  }
}

function Counter({ label, count, buttontype}) {
  if (buttontype === "BT") {
    return <div className='bt bt-count'>{count}</div>
  } else if (buttontype === "FX") {
    return <div className='fx fx-count'>{count}</div>
  } else {
    return <div className='total'>{label + ": " + count} </div>
  }

}

function SDVX() {
  const ButtonsIndex = {
    BT_A: 1,
    BT_B: 2,
    BT_C: 3,
    BT_D: 4,
    FX_L: 5,
    FX_R: 6,
  };

  const AxesIndex = {
    VOL_L: 0,
    VOL_R: 1,
  };

  const [buttons, setButtons] = useState({
    BT_A: false,
    BT_B: false,
    BT_C: false,
    BT_D: false,
    FX_L: false,
    FX_R: false,
  });
  const [prevButtons, setPrevButtons] = useState({
    BT_A: false,
    BT_B: false,
    BT_C: false,
    BT_D: false,
    FX_L: false,
    FX_R: false,
  });
  const [axes, setAxes] = useState({
    VOL_L: 0,
    VOL_R: 0,
  });
  const [buttonsCount, setButtonsCount] = useState({
    BT_A: 0,
    BT_B: 0,
    BT_C: 0,
    BT_D: 0,
    FX_L: 0,
    FX_R: 0,
  })
  const [totalCount, setTotalCount] = useState(0);

  const checkButtonPressed = (previous, button) => {
    if ( !previous && button ) {
      return 1;
    } else {
      return 0;
    }
  }

  const handleConnect = (e) => {
    const gamepads = navigator.getGamepads();
    console.log(e.gamepad.id);
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i] && gamepads[i].id.indexOf("F2 eAcloud") > -1) {
        const axes = {
          VOL_L: gamepads[i].axes[AxesIndex.VOL_L],
          VOL_R: gamepads[i].axes[AxesIndex.VOL_R],
        }
      }
    }
    setInterval(() => {
      const gamepads = navigator.getGamepads();
  
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {

          const newButtons = {
            BT_A: gamepads[i].buttons[ButtonsIndex.BT_A].pressed,
            BT_B: gamepads[i].buttons[ButtonsIndex.BT_B].pressed,
            BT_C: gamepads[i].buttons[ButtonsIndex.BT_C].pressed,
            BT_D: gamepads[i].buttons[ButtonsIndex.BT_D].pressed,
            FX_L: gamepads[i].buttons[ButtonsIndex.FX_L].pressed,
            FX_R: gamepads[i].buttons[ButtonsIndex.FX_R].pressed,
          }
          
          setButtons(() => {
            return newButtons
          });
          
          const newAxes = {
            VOL_L: gamepads[i].axes[AxesIndex.VOL_L],
            VOL_R: gamepads[i].axes[AxesIndex.VOL_R],
          }
          setAxes(newAxes);          

        } 
      }
    }, 1000/120);
  }

  useEffect(() => {
    const a = checkButtonPressed(prevButtons.BT_A, buttons.BT_A);
    const b = checkButtonPressed(prevButtons.BT_B, buttons.BT_B);
    const c = checkButtonPressed(prevButtons.BT_C, buttons.BT_C);
    const d = checkButtonPressed(prevButtons.BT_D, buttons.BT_D);
    const l = checkButtonPressed(prevButtons.FX_L, buttons.FX_L);
    const r = checkButtonPressed(prevButtons.FX_R, buttons.FX_R);

    setTotalCount(total => total + a + b + c + d + l + r);
    setButtonsCount( prev => {
      return {
        BT_A: prev.BT_A + a,
        BT_B: prev.BT_B + b,
        BT_C: prev.BT_C + c,
        BT_D: prev.BT_D + d,
        FX_L: prev.FX_L + l,
        FX_R: prev.FX_R + r,  
      }
    });
    setPrevButtons(() => {
      return {...buttons}
    })

  },[buttons]);

  useEffect(() => {
    window.addEventListener("gamepadconnected",handleConnect);
    return () => {
      window.removeEventListener("gamepadconnected",() => {})
    }
  }, []);

  return (
    <>
      <div className='row-vol row'>
        <Vol axes={axes.VOL_L} type="L" />
        <Vol axes={axes.VOL_R} type="R"/>
      </div>
      <div className='row-bt row'>
        <Button pressed={buttons.BT_A} type="BT" />
        <Button pressed={buttons.BT_B} type="BT" />
        <Button pressed={buttons.BT_C} type="BT" />
        <Button pressed={buttons.BT_D} type="BT" />
      </div>
      <div className='row-fx row'>
        <Button pressed={buttons.FX_L} type="FX" />
        <Button pressed={buttons.FX_R} type="FX" />
      </div>
      <div className='row-count-total row'>
        <Counter label="Total" count={totalCount} />
      </div>
      <div className='row-count-bt row'>
        <Counter label="BT-A" count={buttonsCount.BT_A} buttontype="BT"/>
        <Counter label="BT-B" count={buttonsCount.BT_B} buttontype="BT"/>
        <Counter label="BT-C" count={buttonsCount.BT_C} buttontype="BT"/>
        <Counter label="BT-D" count={buttonsCount.BT_D} buttontype="BT"/>
      </div>
      <div className='row-count-fx row'>
        <Counter label="FX-L" count={buttonsCount.FX_L} buttontype="FX"/>
        <Counter label="FX-R" count={buttonsCount.FX_R} buttontype="FX"/>
      </div>
    </>
  )
};

export default SDVX;
