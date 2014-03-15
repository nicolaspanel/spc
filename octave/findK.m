% find K
function K = findK(lambda_c)
  [A B C]= modelization(); 
  K = place(A, B, lambda_c);
end