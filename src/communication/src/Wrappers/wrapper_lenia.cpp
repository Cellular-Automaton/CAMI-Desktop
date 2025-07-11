/*
** File description:
** main
*/

#include <Plugins/Lenia.hh>
#include <Wrappers/WrapperLenia.hh>

std::vector<double> Wrapper::simulate_lenia(double *tab_init_1D, int R, double kernel_mu,
                                            double kernel_sigma, double growth_mu,
                                            double growth_sigma, int width, int height)
{
    std::vector<std::vector<double>> tab_init_2d{};
    std::vector<double> return_value{};

    for (size_t j{0}; j < height; j++) {
        size_t checkpoint{j * width};
        std::vector<double> tmp{};
        for (size_t i{0}; i < width; i++) {
            tmp.emplace_back(tab_init_1D[i + checkpoint]);
        }
        tab_init_2d.emplace_back(tmp);
        tmp.clear();
    }
    PLC::Lenia lenia{tab_init_2d, R, kernel_mu, kernel_sigma, growth_mu, growth_sigma};
    std::vector<std::vector<double>> simult_result{lenia.activate(2)[1].getTab()};
    for (auto vec : simult_result) {
        for (size_t i{0}; i < vec.size(); i++)
            return_value.emplace_back(vec[i]);
    }

    return return_value;
}
/*

Napi::Object Plugin::init(Napi::Env env, Napi::Object exports)
{
    exports.Set("simulate_lenia", Napi::Function::New(env, Plugin::add_wrapped_lenia));
    exports.Set("simulate_gol", Napi::Function::New(env, Plugin::add_wrapped_gol));
    return exports;
}
*/
