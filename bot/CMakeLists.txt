cmake_minimum_required(VERSION 3.10)
project(brainbot VERSION 1.0)

include_directories(includes)

add_executable(${PROJECT_NAME} src/main.cpp
  includes/brainbot.h includes/listeners.h
  includes/xtra/alert.h includes/constants.h
  includes/collector.h includes/httplib.h
  includes/HttpStatusCodes_C++11.h includes/nlohmann/json
  includes/chatter.h includes/discordlog.h
  
  src/listeners/channelupdate.cpp
  src/listeners/guildcreate.cpp
  src/listeners/guilddelete.cpp
  src/listeners/guildmemberupdate.cpp
  src/listeners/keyexpires.cpp
  src/listeners/messagecreate.cpp
  src/listeners/messageupdate.cpp
  src/listeners/ready.cpp
  src/xtra/alert.cpp
  src/xtra/collector.cpp
  src/chatter.cpp
  src/discordlog.cpp
)

set_target_properties(${PROJECT_NAME} PROPERTIES CXX_STANDARD 20)
target_include_directories(${PROJECT_NAME} PRIVATE crypto dpp hiredis pthread fmt ssl spdlog sw)
target_link_libraries(${PROJECT_NAME} PRIVATE crypto dpp hiredis pthread redis++ fmt ssl spdlog)