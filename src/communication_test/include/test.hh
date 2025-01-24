/*
** FF, 2024
** /home/a/EIP/CAMI-Desktop/communication_test/plugin_test/include
** File description:
** test
*/

#pragma once

#include <Lenia.hh>
#include <napi.h>
#include <vector>

namespace Plugin
{

    std::vector<double> simulate_lenia(double *tab_init, int R, double kernel_mu,
                                       double kernel_sigma, double growth_mu, double growth_sigma,
                                       int size_x, int size_y);

    Napi::Float64Array addWrapped(const Napi::CallbackInfo &info);
    Napi::Object Init(Napi::Env env, Napi::Object exports);
    NODE_API_MODULE(addon, Init)

} // namespace Plugin
