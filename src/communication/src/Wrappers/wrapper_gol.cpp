/*
** File description:
** main
*/

#include <Plugins/GameOfLife.hh>
#include <Wrappers/WrapperGol.hh>

std::vector<size_t> Wrapper::simulate_gol(unsigned int *tab_init_1D, size_t width, size_t height)
{
    std::vector<std::vector<size_t>> tab_init_2d{};
    std::vector<size_t> return_value{};

    for (size_t j{0}; j < height; j++) {
        size_t checkpoint{j * width};
        std::vector<size_t> tmp{};
        for (size_t i{0}; i < width; i++) {
            tmp.emplace_back(tab_init_1D[i + checkpoint]);
        }
        tab_init_2d.emplace_back(tmp);
        tmp.clear();
    }
    PLC::GameOfLife gol{tab_init_2d};
    std::vector<std::vector<size_t>> simult_result{gol.activate(2)[1].getTab()};
    for (auto vec : simult_result) {
        for (size_t i{0}; i < vec.size(); i++) {
            return_value.emplace_back(vec[i]);
        }
    }
    return return_value;
}
/*

*/
