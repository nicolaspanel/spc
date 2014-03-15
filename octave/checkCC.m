%% Check that system is Completelly controllable
function ok = checkCC()
  ok = false;
  
  [A B C] = modelization(); 
  % check CC 
  if (is_controllable(A,B))
    printf("System is controllable - OK\n");
    ok = true;
  else
    printf("System is NOT controllable !!! KO\n");
    ok = false;
  endif
end