<?php

$size = (int)readline('input size: ');
$input = [];
for ($i = 0; $i < $size; $i++) {
    array_push($input, (int)readline());
}

echo ("Input");
print_r($input);
// $input = [4, 73, 67, 38, 33];
$output = [];

for ($i = 0; $i < count($input); $i++) {
    $nilai = $input[$i];

    if ($nilai < 38) {
        array_push($output, $nilai);
        continue;
    }

    // get rounded value
    $rounded = $nilai - ($nilai % 5) + 5;

    // check
    // if $rounded - $nilai < 3 then push rounded value into output
    // else push real value into output
    if ($rounded - $nilai < 3) {
        array_push($output, $rounded);
    } else {
        array_push($output, $nilai);
    }
}

echo ("Output:");
print_r($output);
