/*
** File description:
** main
*/

#include "Lenia.hh"
#include <test.hh>

std::vector<double> Plugin::simulate_lenia(double *tab_init_1D, int R, double kernel_mu,
                                           double kernel_sigma, double growth_mu,
                                           double growth_sigma, int width, int height)
{
    std::vector<std::vector<double>> tab_init_2d{};
    std::vector<double> return_value{};

    for (size_t j{0}; j < height; j++) {
        size_t checkpoint{j * width};
        for (size_t i{0}; i < width; i++) {
            std::vector<double> tmp{};
            tmp.emplace_back(tab_init_1D[i + checkpoint]);
            tab_init_2d.emplace_back(tmp);
        }
    }
    PLC::Lenia lenia{tab_init_2d, R, kernel_mu, kernel_sigma, growth_mu, growth_sigma};
    std::vector<std::vector<double>> simult_result{lenia.activate(1)[0].getTab()};
    for (auto vec : simult_result) {
        for (size_t i{0}; i < vec.size(); i++)
            return_value.emplace_back(vec[i]);
    }

    return return_value;
}

Napi::Float64Array Plugin::addWrapped(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env(); // check if arguments are integer only.
    /*    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
            Napi::TypeError::New(env, "arg1::Number, arg2::Number expected")
                .ThrowAsJavaScriptException();
        }*/ // convert javascripts datatype to c++
    Napi::Float64Array first = info[0].As<Napi::Float64Array>();
    Napi::Number second =
        info[1].As<Napi::Number>(); // run c++ function return value and return it in javascript
    Napi::Number third = info[2].As<Napi::Number>();
    Napi::Number fourth = info[3].As<Napi::Number>();
    Napi::Number fifth = info[4].As<Napi::Number>();
    Napi::Number six = info[5].As<Napi::Number>();
    Napi::Number seven = info[6].As<Napi::Number>();
    Napi::Number eight = info[7].As<Napi::Number>();

    Napi::Float64Array return_value = Napi::Float64Array::New(env, first.ByteLength() / 8);

    std::vector<double> val{Plugin::simulate_lenia(
        first.Data(), second.Int32Value(), third.FloatValue(), fourth.FloatValue(),
        fifth.FloatValue(), six.FloatValue(), seven.Int32Value(), eight.FloatValue())};
    for (size_t i{0}; i < val.size(); i++)
        return_value.Set(i, val[i]);
    /*api::Array Napi::Array returnValue = Napi::Array::New(
        env,
        Plugin::simulate_lenia(first.Float32Array(), second.Float32Value(),
       third.Float32Value(), fourth.Float32Value(), fifth.Float32Value(), six.Float32Value(),
                               seven.Float32Value(), ));

                               */
    return return_value;
}

Napi::Object Plugin::Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("simulate_lenia", Napi::Function::New(env, Plugin::addWrapped));
    return exports;
}
