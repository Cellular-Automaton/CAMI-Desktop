/*
** EPITECH PROJECT, 2023
** CAMI-Desktop/src/communication_test/src
** File description:
** init
*/

#include <WrapperInit.hh>
#include <Wrappers/WrapperGol.hh>
#include <Wrappers/WrapperLenia.hh>
#include <iostream>

Napi::Float64Array Wrapper::add_wrapped_lenia(const Napi::CallbackInfo &info)
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

    std::vector<double> val{Wrapper::simulate_lenia(
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

Napi::Uint32Array Wrapper::add_wrapped_gol(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env(); // check if arguments are integer only.
    /*    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
            Napi::TypeError::New(env, "arg1::Number, arg2::Number expected")
                .ThrowAsJavaScriptException();
        }*/ // convert javascripts datatype to c++
    Napi::Uint32Array first = info[0].As<Napi::Uint32Array>();
    Napi::Number second = info[1].As<Napi::Number>();
    Napi::Number third = info[2].As<Napi::Number>();

    Napi::Uint32Array return_value = Napi::Uint32Array::New(env, first.ByteLength() / 4);

    std::vector<size_t> val{
        Wrapper::simulate_gol(first.Data(), second.Uint32Value(), third.Uint32Value())};
    for (size_t i{0}; i < val.size(); i++) {
        return_value.Set(i, val[i]);
    }
    /*api::Array Napi::Array returnValue = Napi::Array::New(
        env,
        Plugin::simulate_lenia(first.Float32Array(), second.Float32Value(),
       third.Float32Value(), fourth.Float32Value(), fifth.Float32Value(), six.Float32Value(),
                               seven.Float32Value(), ));

                               */
    return return_value;
}

Napi::Object Wrapper::init(Napi::Env env, Napi::Object exports)
{
    exports.Set("simulate_lenia", Napi::Function::New(env, Wrapper::add_wrapped_lenia));
    exports.Set("simulate_gol", Napi::Function::New(env, Wrapper::add_wrapped_gol));
    return exports;
}
