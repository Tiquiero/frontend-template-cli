/*
 * @Author: linxun 
 * @Date: 2021-05-22 14:31:48 
 * @Last Modified by: linxun
 * @Last Modified time: 2021-05-29 10:26:23
 * @Description: 键盘事件hooks
 */

import { useState, useEffect } from 'react';

const useKeyPress = (targetKey: string | string[]) => {
  const [keyPressed, setKeyPressed] = useState<boolean>(false);

  const downHandler = ({ code }: { code: string }) => {
    if (code === targetKey || targetKey.includes(code)) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ code }: { code: string }) => {
    if (code === targetKey || targetKey.includes(code)) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);
  return keyPressed;
};

export default useKeyPress;