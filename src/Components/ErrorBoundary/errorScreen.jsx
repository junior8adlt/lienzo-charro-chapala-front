import React from 'react';
import { Button, Result } from 'antd';

export const ErrorScreen = () => {
  return (
    <>
      <Result
        status='500'
        title='500'
        subTitle='Sorry, something went wrong.'
        className='error-screen'
        extra={
          <Button
            type='primary'
            onClick={() => {
              window.location.reload();
            }}
            size='large'
          >
            Reload
          </Button>
        }
      />
    </>
  );
};
