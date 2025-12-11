import React from 'react';
import AlgorithmCard from '../AlgorithmCard/AlgorithmCard.jsx';

const HorizontalScroll = ({algorithms, onClickCallback, favorite}) => {

    return (
        <div>
            <div className="flex w-full gap-4 p-4">
                {algorithms.map((algorithm, index) => (
                    <AlgorithmCard key={algorithm.automaton_id} algorithm={algorithm} onClickCallback={onClickCallback} favorite={favorite} />
                ))}
            </div>
        </div>
    );
};

export default HorizontalScroll;