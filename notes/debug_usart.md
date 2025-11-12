## CUBEMX Configuration

### USART2
- Mode: Asynchronous
- Baud Rate: 115200
- Word Length: 8 bits (including parity)
- Parity: None
- Stop Bits: 1
- Data Direction: Receive and Transmit
> Not receiving anything for debugging but just leaving for future-proof
- Over Sampling: 16 Samples

### Clock

- I changed it to 100 MHz (Max Possible)

## Code

```diff
diff --git a/main.c b/mcopy.c
index 3a522dc..3ec2596 100644
--- a/main.c
+++ b/mcopy.c
@@ -21,6 +21,7 @@
/* Private includes ----------------------------------------------------------*/
/* USER CODE BEGIN Includes */
+#include <stdio.h>
+#include <string.h>
/* USER CODE END Includes */
@@ -98,8 +99,11 @@ int main(void)
/* USER CODE BEGIN WHILE */
+ static uint8_t msg[50];
+ static uint8_t counter = 0;
while (1)
{
+ sprintf((char*)msg, "Counter = %d\r\n", counter++);
+ HAL_UART_Transmit(&huart2, msg, strlen((char*)msg), 100);
+ HAL_Delay(500);
/* USER CODE END WHILE */
/* USER CODE BEGIN 3 */
}
/* USER CODE END 3 */
```
