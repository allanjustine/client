import React, { useState, useEffect } from 'react';
import smct from '../img/smct.png';

const Loading = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            if (progress < 100) {
                setProgress(prevProgress => prevProgress + 10);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [progress]);
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center p-20">
                <div className="flex items-center justify-center">
                    <img src={smct} style={{ width: '600px' }} alt='Logo' />
                </div>
                <div className="w-full bg-gray-200 rounded-lg overflow-hidden h-10 mt-5">
                    <div
                        className="bg-blue-500 h-full"
                        style={{ width: `${progress}%`, transition: 'width 2s ease-out' }}
                    >
                        <p className='text-xl text-white text-center pt-1'><strong>Loading...</strong></p></div>
                </div>
            </div>

        </div>
    );
};

export default Loading;
