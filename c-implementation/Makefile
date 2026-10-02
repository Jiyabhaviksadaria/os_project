# Makefile for ParcelHub POSIX C Implementation

CC = gcc
CFLAGS = -Wall -Wextra -pthread -O2
TARGET = parcelhub
SRC = parcelhub.c

all: build

build: $(SRC)
	$(CC) $(CFLAGS) $(SRC) -o $(TARGET)

run: build
	./$(TARGET) 8 3 3

clean:
	rm -f $(TARGET)

.PHONY: all build run clean
