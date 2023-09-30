#!/usr/bin/perl
use strict;
use warnings;
use JSON;
use File::Slurp;
use utf8;

binmode(STDOUT, ":encoding(UTF-8)");
print("<!doctype html>\n<html><head><meta charset='utf-8' /><body><ul>");

while (<*.json>)
{
    my $c = read_file($_);
    my $j = decode_json($c);
    s/\.json//;
    print("<li><a href='https://matematyka.fork.pl/quiz.html#$_'>$j->{title}</a></li>\n");
}
