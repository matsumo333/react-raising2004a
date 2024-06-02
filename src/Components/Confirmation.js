import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Confirmation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/eventlist');
        }, 1);

        return () => clearTimeout(timer); // クリーンアップ関数
    }, [navigate]);

    return (
        <div>Confirmation</div>
    );
}

export default Confirmation;
