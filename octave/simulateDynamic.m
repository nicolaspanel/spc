
x_0 = [0;1]; % initial 

function xdot = f_cust(x, t)
  [A B C] = modelization();
  u = 0;
  xdot = A * x + B * u;
endfunction

%% Simulations

X=lsode("f_cust", x_0,(t=linspace(0,2,20)'));
figure (1);
plot(t, X(:, 2)); %speed
X(20, :)


