cmake_minimum_required(VERSION 3.15)
cmake_policy(SET CMP0091 NEW)
cmake_policy(SET CMP0042 NEW)

project(addon)

add_definitions(-DNAPI_VERSION=4)

include_directories(${CMAKE_JS_INC})
include_directories(${CMAKE_SOURCE_DIR}/include)

file(GLOB SOURCE_FILES "src/*.cpp" "src/Wrappers/*.cpp")

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES
    PREFIX ""
    SUFFIX ".node"
    LIBRARY_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/algorithms
    RUNTIME_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/algorithms
    ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_SOURCE_DIR}/algorithms
    LIBRARY_OUTPUT_DIRECTORY_DEBUG ${CMAKE_SOURCE_DIR}/algorithms
    RUNTIME_OUTPUT_DIRECTORY_DEBUG ${CMAKE_SOURCE_DIR}/algorithms
    ARCHIVE_OUTPUT_DIRECTORY_DEBUG ${CMAKE_SOURCE_DIR}/algorithms
    LIBRARY_OUTPUT_DIRECTORY_RELEASE ${CMAKE_SOURCE_DIR}/algorithms
    RUNTIME_OUTPUT_DIRECTORY_RELEASE ${CMAKE_SOURCE_DIR}/algorithms
    ARCHIVE_OUTPUT_DIRECTORY_RELEASE ${CMAKE_SOURCE_DIR}/algorithms
)
# Specify the output directory
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})

# Add the path to the directory containing cami-core library
link_directories(${CMAKE_SOURCE_DIR}/libs)

# Debugging messages to check paths
message(STATUS "CMAKE_SOURCE_DIR: ${CMAKE_SOURCE_DIR}")
message(STATUS "LIBRARY_OUTPUT_DIRECTORY: ${CMAKE_SOURCE_DIR}/algorithms")
message(STATUS "cami-core.dll path: ${CMAKE_SOURCE_DIR}/libs/cami-core.dll")
message(STATUS "cami-core.lib path: ${CMAKE_SOURCE_DIR}/libs/cami-core.lib")

if (WIN32)
    # Add the cami-core library for Windows
    add_library(cami-core SHARED IMPORTED)
    set_target_properties(cami-core PROPERTIES
      IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/libs/cami-core.dll
      IMPORTED_IMPLIB ${CMAKE_SOURCE_DIR}/libs/cami-core.lib
    )
else()
    # Add the cami-core library for Linux
    add_library(cami-core SHARED IMPORTED)
    set_target_properties(cami-core PROPERTIES
      IMPORTED_LOCATION ${CMAKE_SOURCE_DIR}/libs/cami-core.so
    )
endif()

# Link the cami-core library to your target
target_link_libraries(${PROJECT_NAME} cami-core)

if(MSVC AND CMAKE_JS_NODELIB_DEF AND CMAKE_JS_NODELIB_TARGET)
  # Generate node.lib
  execute_process(COMMAND ${CMAKE_AR} /def:${CMAKE_JS_NODELIB_DEF} /out:${CMAKE_JS_NODELIB_TARGET} ${CMAKE_STATIC_LINKER_FLAGS})
endif()

# Custom target to clean all undesirable files
add_custom_target(clean_all
    COMMAND ${CMAKE_COMMAND} -P ${CMAKE_SOURCE_DIR}/cmake/clean_all.cmake
)