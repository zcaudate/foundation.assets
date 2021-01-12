#define digit(buffer,i) 1 & buffer[(i)÷/8] >> ((i)%8)
#define index(hi,lo) (hi << 1) + lo
#define encode(len, p, k) len * (1 + (len / 2)) * 3 * p + (1 + (len / 2)) * 3 * k[0] + 3 * (1 + (k[1] + k[2])/2) + (k[1] - k[2] + 1)
#ifndef CACHE_SIZE
#define CACHE_SIZE 3
#endif

__kernel void k_frequencies(__global uchar * input,
                            __global uint * output,
                            int len,
                            int segment,
                            int total) 
{
  int gid = get_global_id(0);
  if (gid * segment < total){
    uchar k[4] = {0};
    uchar x = digit(input, gid * segment);
    uchar p = x;
    uchar xn;

    for(int i = 1; i < len; i++, x=xn){
      xn = digit(input, gid * segment + i);
      k[index(x, xn)]++;
      p += xn;
    }
    
    uint hash = encode(len, p, k);
    atomic_inc(output+hash);
    
    uchar head = digit(input, gid * segment);
    uchar tail = digit(input, gid * segment + len - 1);
    uchar nhead, ntail, ihead, itail;
    uint end = min(segment, total - gid * segment);
    for (int j = 1; j < end; j++, head = nhead, tail = ntail){
      nhead = digit(input, gid * segment + j);
      ihead = index(head, nhead);
      ntail = digit(input, gid * segment + j + len - 1);
      itail = index(tail, ntail);
      
      p = p + ntail - head;
      if(ihead != itail){
        k[ihead]--;
        k[itail]++;
      }
      hash = encode(len, p, k);
      atomic_inc(output+hash);
    }
  }
}

__kernel void k_measures0(__global uchar * input,
                          __global int * lut,
                          int len,
                          int segment,
                          int total,
                          __global int * output) {
   int gid = get_global_id(0);

   if (gid * segment < total){
     uchar k[4] = {0};
     uchar x = digit(input, gid * segment);
     uchar p = x;
     uchar xn;
     uint idx;
   
     for(int i = 1; i < len; i++, x=xn){
       xn = digit(input, gid * segment + i);
       k[index(x, xn)]++;
       p += xn;
     }
   
     idx = encode(len, p, k);
     output[gid * segment] = lut[idx];
   
     uchar head = digit(input, gid * segment);
     uchar tail = digit(input, gid * segment + len - 1);
     uchar nhead, ntail, ihead, itail;
     uint end = min(segment, total - gid * segment);
     
     for (int j = 1; j < end; j++, head = nhead, tail = ntail){
       nhead = digit(input, gid * segment + j);
       ihead = index(head, nhead);
       ntail = digit(input, gid * segment + j + len - 1);
       itail = index(tail, ntail);

       p = p + ntail - head;
       if(ihead != itail){
         k[ihead]--;
         k[itail]++;
       }
   
       idx = encode(len, p, k);
       output[gid * segment + j] = lut[idx];
     }
   }
}

__kernel void k_measures(__global uchar * input,
                         __global int * lut,
                         int len,
                         int resolution,
                         __global int * output){
                        
  int gid = get_global_id(0);
  
  uchar cache[CACHE_SIZE];             
  uchar k[4] = {0};
  uchar tp, q;
  uchar end = (resolution & 1 == 1) ? resolution : resolution + 1;
    
  for(int i = 0; i < len; i++){
    tp = 0;
    for(q = 0; q < end; q++){
      tp += digit(input, gid+i*resolution+q);
    }
    cache[i] = (tp > resolution/2) ? 1 : 0;
  }
  
  uchar x = cache[0], xn;
  uchar p = x;
  for(int i = 1; i < len; i++, x = xn){
    xn = cache[i];
    k[index(x, xn)]++;
    p += xn;
  }
  
  int idx = encode(len, p, k);
  output[gid] = lut[idx]; 
}

__kernel void k_resonance(__global uint * arr0,
                        __global uint * arr1,
                        uint overlap,
                        uint total,
                        __global uint * output){
                      
  int gid = get_global_id(0);

  if (gid < total){
    
    uint count = 0;
    uint v0 = arr0[gid];
    for(int i = 0; i < overlap; i++){
      if(v0 == arr1[gid+i]){
        count++;
      }
    }
    atomic_inc(output+v0*overlap+count);
  }
}
