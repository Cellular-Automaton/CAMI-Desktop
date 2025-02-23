/*
** FF, 2024
** CAMI-Desktop/communication_test/plugin_test/include
** File description:
** test
*/

#pragma once

// #include <WrapperInit.hh>
#include <vector>

namespace Wrapper
{
    std::vector<double> simulate_lenia(double *tab_init, int R, double kernel_mu,
                                       double kernel_sigma, double growth_mu, double growth_sigma,
                                       int size_x, int size_y);

} // namespace Wrapper
