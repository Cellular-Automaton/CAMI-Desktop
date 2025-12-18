import React from 'react';

const SimulationInformation = () => {
    return (
        <div id="simulation-information" className='flex flex-row h-full w-full relative bg-midnight px-6 py-8 gap-5'>
            <div id="algorithm-information" className='flex flex-col w-4/6 gap-5'>
                <div id="algorithm-image" className='flex flex-col w-full h-3/5 px-8 py-5 justify-center items-center'>
                    <div className='flex flex-col w-5/6 h-auto'>
                        <img src="https://images.squarespace-cdn.com/content/v1/59413d96e6f2e1c6837c7ecd/1592233649594-7UQA8NZSNXMZWX86FIWN/JB_Game_of_Life.gif?format=2500w"
                            alt="Conway's Game of Life" className=' object-cover w-full rounded-md'/>
                        <div className='flex flex-col w-full h-full py-1'>
                            <h1 className='text-2xl font-bold text-white'>Conway's Game of Life</h1>
                        </div>
                    </div>
                </div>
                <div id="algorithm-description" className='flex flex-col w-full h-2/5 px-8 py-5 justify-center items-center'>
                    <div className='flex flex-col w-5/6 h-full overflow-scroll'>
                        <p className='text-lg text-white'>
                        Conway's Game of Life is a cellular automaton devised by mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined by its initial state, with no further input required. The game consists of a grid of cells that can either be "alive" or "dead." The cells evolve in discrete time steps according to a set of rules:
                        Any live cell with two or three live neighbors survives.
                        Any dead cell with exactly three live neighbors becomes a live cell.
                        All other live cells die, and all other dead cells remain dead.
                        The game's simplicity leads to complex patterns that can simulate a variety of phenomena, such as growth, decay, and oscillation. Conway’s Game of Life is famous for demonstrating how simple rules can lead to emergent complexity, and it has inspired a variety of studies in mathematics, computer science, and artificial life.
                        </p>
                    </div>
                </div>
            </div>
            <div id="algorithm-parameters" className='flex flex-col w-2/6 justify-around'>
                <div id="algorithm-parameters" className='flex flex-col w-full h-5/6 py-10 gap-10'>
                    <div className='flex flex-row justify-between items-center'>
                        <p className='text-xl font-bold text-white'>Parameters</p>
                        <hr className='border-t-2 border-gray-400 w-full ml-4' />
                        <div>
                            {/* Faire la boucle pour mettre les paramètres */}
                        </div>
                    </div>
                    {/* Pour les simulations existantes */}
                    <div className='flex flex-row justify-between items-center'>
                        <p className='text-xl font-bold text-white'>Informations</p>
                        <hr className='border-t-2 border-gray-400 w-full ml-4' />
                        <div>
                            {/* Faire la boucle pour mettre les paramètres */}
                        </div>
                    </div>
                </div>
                <div id='algorithm-start-download' className='flex flex-col w-full h-1/6 justify-center items-center'>
                    <button className='flex flex-col justify-center items-center w-4/5 h-2/5 py-4 gap-4
                        bg-primary text-midnight-text rounded-3xl mx-auto'>
                        <p className='text-lg font-bold'>Download / Start</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimulationInformation;