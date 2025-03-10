<xml xmlns="http://www.w3.org/1999/xhtml">
  <variables>
    <variable type="" id="*:})YLa%H%Hy=|)4xdb4">req</variable>
    <variable type="" id="t=]D}Be^3NOs`s-Hmk1#">text</variable>
    <variable type="" id=",{^YR5]O!g4=GEZ9Es9Y">RLED</variable>
    <variable type="" id="2B|tVwg`2lg$j|LV=vT4">GLED</variable>
    <variable type="" id="pq[`/E]Yx|29J2OWpY^V">BLED</variable>
  </variables>
  <block type="variables_set" id="o.2Hso8{`yg9MdOU42V%" x="788" y="-637">
    <field name="VALUE1">String</field>
    <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
    <value name="VALUE">
      <block type="text" id=":49*MDvlz)eA%7SSRn==">
        <field name="TEXT"></field>
      </block>
    </value>
    <next>
      <block type="variables_set" id="Q+b!M#PR$_VGs@FzT5I#">
        <field name="VALUE1">int</field>
        <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
        <next>
          <block type="variables_set" id="BgpERL~_0M7USS?[2{3n">
            <field name="VALUE1">int</field>
            <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
            <next>
              <block type="variables_set" id="}H`e%%#zJ^VwRC$_Q.W+">
                <field name="VALUE1">int</field>
                <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                <next>
                  <block type="start" id="J+=-}0ErRe2jx7=-(PKz">
                    <statement name="setup">
                      <block type="simplewificonnectesp" id="VK3*4F5^z@zhdA=1B8c6">
                        <value name="ssid">
                          <shadow type="text3" id="2Np(B/z%!0OCl`iJj{+^">
                            <field name="TEXT">maker center-1</field>
                          </shadow>
                        </value>
                        <value name="pass">
                          <shadow type="text3" id="]Yh.ZBPJoVg9,TjSn;5N">
                            <field name="TEXT"></field>
                          </shadow>
                        </value>
                        <next>
                          <block type="oled_page" id="wULcaA;p-RL;cz;QMH|R">
                            <statement name="oled_statement">
                              <block type="oled_textprint1" id="2;RCQ,VbE%h`,4!,1oU{">
                                <value name="x">
                                  <shadow type="math_number" id="0(jp%Oa4Z;_x.D#uW^M?">
                                    <field name="NUM">0</field>
                                  </shadow>
                                </value>
                                <value name="y">
                                  <shadow type="math_number" id="4LWb/wvI9h96a5s_r+|;">
                                    <field name="NUM">0</field>
                                  </shadow>
                                </value>
                                <value name="text">
                                  <shadow type="text3" id="2@?d5(ddIvN#/ubcrCU]">
                                    <field name="TEXT">309-01-02</field>
                                  </shadow>
                                </value>
                                <next>
                                  <block type="oled_textprint1" id="yK2[^c!VC;q2q_FRf/@k">
                                    <value name="x">
                                      <shadow type="math_number" id="wG@XXIFN5nk[@RpT_86_">
                                        <field name="NUM">0</field>
                                      </shadow>
                                    </value>
                                    <value name="y">
                                      <shadow type="math_number" id="dF%;k=47Rj*TFOP|1}Ya">
                                        <field name="NUM">16</field>
                                      </shadow>
                                    </value>
                                    <value name="text">
                                      <shadow type="text3" id=",t:Ky[.}Tc|Rt+S)_*{[">
                                        <field name="TEXT">Hello World</field>
                                      </shadow>
                                      <block type="wifiip22esp" id="=z}pL=)sK~s/$ayc42]a"></block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </statement>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <statement name="loop">
                      <block type="simplewebserverbeginesp" id="fICZ}AR6()h%}aUCtH{0">
                        <value name="port">
                          <shadow type="math_number" id="FfgWl^/;nAH^|l3_hx]E">
                            <field name="NUM">80</field>
                          </shadow>
                        </value>
                        <next>
                          <block type="simple_conditionesp" id="X92D_]e,PYCd%@%2s85n">
                            <value name="condition">
                              <shadow type="text3" id="x^mUZrx/dn-3JP6pvwef">
                                <field name="TEXT">/rgb1=</field>
                              </shadow>
                            </value>
                            <statement name="NAME">
                              <block type="text_replace" id="u/1S}ILn!E^tTp1%zI5~">
                                <value name="TEXT">
                                  <block type="variables_get" id="BrLZ.sju2HOsBVjJvCj|">
                                    <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
                                  </block>
                                </value>
                                <value name="TO">
                                  <shadow type="text" id="6}7mBX;(cl.p[^Ya_[~5">
                                    <field name="TEXT"></field>
                                  </shadow>
                                </value>
                                <value name="FROM">
                                  <shadow type="text" id="HsFn+%IvYFW$vUXKaBt.">
                                    <field name="TEXT">/rgb1=</field>
                                  </shadow>
                                </value>
                                <next>
                                  <block type="math_change" id="$muC2PfKB$0sN~c441U2">
                                    <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                    <value name="DELTA">
                                      <shadow type="math_number" id="{o~^x8$j$CC@CWV,B_i2">
                                        <field name="NUM">1</field>
                                      </shadow>
                                      <block type="transformer" id="i#3hqMir%UClG|ij0k0Q">
                                        <field name="NAME">int</field>
                                        <value name="value">
                                          <block type="variables_get" id="w+y;r@n|a0ZgF^vOHn1^">
                                            <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <next>
                                      <block type="pocketled5" id="ZE()z}AB=mm0:qdL;G1]">
                                        <value name="num2">
                                          <shadow type="math_number" id="U::I%ns;Yp3B|W?uff4f">
                                            <field name="NUM">0</field>
                                          </shadow>
                                          <block type="variables_get" id="X^.B4Y:Fi)6,H!dz9}p*">
                                            <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                          </block>
                                        </value>
                                        <value name="num1">
                                          <shadow type="math_number" id="[LkWmQGEIUn+h_d|61=k">
                                            <field name="NUM">0</field>
                                          </shadow>
                                          <block type="variables_get" id="6mN$Q$P)BWo].TGUTaCG">
                                            <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                          </block>
                                        </value>
                                        <value name="num3">
                                          <shadow type="math_number" id="friFF+sj9XCZjM=+QlJU">
                                            <field name="NUM">0</field>
                                          </shadow>
                                          <block type="variables_get" id="Fsky1[w#S`l7Ya}b$qVA">
                                            <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                          </block>
                                        </value>
                                        <next>
                                          <block type="simplewebserverprintesp" id=";J!~x/$o)RIu!N6=2$qH">
                                            <value name="print">
                                              <shadow type="text3" id="`n*6y#Oxn=Hjiab`B*C^">
                                                <field name="TEXT">print_html</field>
                                              </shadow>
                                              <block type="text_join" id=";hw%ZKWP#YO^?jlH*/FS">
                                                <mutation items="2"></mutation>
                                                <value name="ADD0">
                                                  <block type="text" id="r3Vtokb8`ZYLfja=?~-!">
                                                    <field name="TEXT">RLED PWM=</field>
                                                  </block>
                                                </value>
                                                <value name="ADD1">
                                                  <block type="variables_get" id="Z)%.AFI)7Zhvo_YXEk^l">
                                                    <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
                                                  </block>
                                                </value>
                                              </block>
                                            </value>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </statement>
                            <next>
                              <block type="simple_conditionesp" id="|E%0s=ERc]@}rS)WZsXR">
                                <value name="condition">
                                  <shadow type="text3" id="zCBOBt{,W/|h%:7]xbGN">
                                    <field name="TEXT">/rgb2=</field>
                                  </shadow>
                                </value>
                                <statement name="NAME">
                                  <block type="text_replace" id="m#K^SQ4%8[6mW!:Xeqz=">
                                    <value name="TEXT">
                                      <block type="variables_get" id="VHl:-TjGFVIU|e*VXKtp">
                                        <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
                                      </block>
                                    </value>
                                    <value name="TO">
                                      <shadow type="text" id="_=htd}6,28NHTKTpb+vU">
                                        <field name="TEXT"></field>
                                      </shadow>
                                    </value>
                                    <value name="FROM">
                                      <shadow type="text" id="K2:]ysbCJBMn}rYIFGsc">
                                        <field name="TEXT">/rgb2=</field>
                                      </shadow>
                                    </value>
                                    <next>
                                      <block type="math_change" id="TBhqWRz^GF(K|i?DMdT=">
                                        <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                        <value name="DELTA">
                                          <shadow type="math_number" id="{o~^x8$j$CC@CWV,B_i2">
                                            <field name="NUM">1</field>
                                          </shadow>
                                          <block type="transformer" id="~$/]L#JN:;q6O3dT373%">
                                            <field name="NAME">int</field>
                                            <value name="value">
                                              <block type="variables_get" id="eS=mvqf#co+ti3(4uuGp">
                                                <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
                                              </block>
                                            </value>
                                          </block>
                                        </value>
                                        <next>
                                          <block type="pocketled5" id="L#z=k0;-T{4C!1ziWMUn">
                                            <value name="num2">
                                              <shadow type="math_number" id="U::I%ns;Yp3B|W?uff4f">
                                                <field name="NUM">0</field>
                                              </shadow>
                                              <block type="variables_get" id="lAJ?i$+pAHHt^}5x5Jso">
                                                <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                              </block>
                                            </value>
                                            <value name="num1">
                                              <shadow type="math_number" id="[LkWmQGEIUn+h_d|61=k">
                                                <field name="NUM">0</field>
                                              </shadow>
                                              <block type="variables_get" id="[Ik9(020mw4-Pj.lt%gB">
                                                <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                              </block>
                                            </value>
                                            <value name="num3">
                                              <shadow type="math_number" id="friFF+sj9XCZjM=+QlJU">
                                                <field name="NUM">0</field>
                                              </shadow>
                                              <block type="variables_get" id="Ax*L6JkZtMVg`E4B|SQR">
                                                <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                              </block>
                                            </value>
                                            <next>
                                              <block type="simplewebserverprintesp" id="/7?2Q_lPf;2_Rr10-{MO">
                                                <value name="print">
                                                  <shadow type="text3" id="`n*6y#Oxn=Hjiab`B*C^">
                                                    <field name="TEXT">print_html</field>
                                                  </shadow>
                                                  <block type="text_join" id="=ig?Nu,PmvrnXI7JndJ_">
                                                    <mutation items="2"></mutation>
                                                    <value name="ADD0">
                                                      <block type="text" id="`=^;5)h(W[Zpw~CX_|pW">
                                                        <field name="TEXT">GLED PWM=</field>
                                                      </block>
                                                    </value>
                                                    <value name="ADD1">
                                                      <block type="variables_get" id="R*cfnoqlA{/0vW{pAHc{">
                                                        <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
                                                      </block>
                                                    </value>
                                                  </block>
                                                </value>
                                              </block>
                                            </next>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </statement>
                                <next>
                                  <block type="simple_conditionesp" id="WC/D8ubS#ME5aNsx1?}q">
                                    <value name="condition">
                                      <shadow type="text3" id="3,|s8wV*VQi13+?u02=J">
                                        <field name="TEXT">/rgb3=</field>
                                      </shadow>
                                    </value>
                                    <statement name="NAME">
                                      <block type="text_replace" id="mUaH`Wgp[YQCyN#)r$eS">
                                        <value name="TEXT">
                                          <block type="variables_get" id="D`4a^C`3U*dME|a0dqQQ">
                                            <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
                                          </block>
                                        </value>
                                        <value name="TO">
                                          <shadow type="text" id="_Slu=1%S]pOYAm:btk5s">
                                            <field name="TEXT"></field>
                                          </shadow>
                                        </value>
                                        <value name="FROM">
                                          <shadow type="text" id="nYTxUob8R9$s!Ky;jtM3">
                                            <field name="TEXT">/rgb3=</field>
                                          </shadow>
                                        </value>
                                        <next>
                                          <block type="math_change" id="d5V_v=A:B3!@IS@5kWQc">
                                            <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                            <value name="DELTA">
                                              <shadow type="math_number" id="{o~^x8$j$CC@CWV,B_i2">
                                                <field name="NUM">1</field>
                                              </shadow>
                                              <block type="transformer" id="PquYj86I7Nhvpcd(@Wgw">
                                                <field name="NAME">int</field>
                                                <value name="value">
                                                  <block type="variables_get" id="ai^(^@NVR63T,#i:mo}q">
                                                    <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
                                                  </block>
                                                </value>
                                              </block>
                                            </value>
                                            <next>
                                              <block type="pocketled5" id="!$f3kFYEk]tunYPew7ve">
                                                <value name="num2">
                                                  <shadow type="math_number" id="U::I%ns;Yp3B|W?uff4f">
                                                    <field name="NUM">0</field>
                                                  </shadow>
                                                  <block type="variables_get" id="+:GfQFWkCQC!KvrgMnMv">
                                                    <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                                  </block>
                                                </value>
                                                <value name="num1">
                                                  <shadow type="math_number" id="[LkWmQGEIUn+h_d|61=k">
                                                    <field name="NUM">0</field>
                                                  </shadow>
                                                  <block type="variables_get" id="tqrtnWHPH?zP_1%z?iaN">
                                                    <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                                  </block>
                                                </value>
                                                <value name="num3">
                                                  <shadow type="math_number" id="friFF+sj9XCZjM=+QlJU">
                                                    <field name="NUM">0</field>
                                                  </shadow>
                                                  <block type="variables_get" id="g@V-%w:iWQm.PBJOhf~-">
                                                    <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                                  </block>
                                                </value>
                                                <next>
                                                  <block type="simplewebserverprintesp" id="U/8z$q^M,.qWLHH3jv_V">
                                                    <value name="print">
                                                      <shadow type="text3" id="`n*6y#Oxn=Hjiab`B*C^">
                                                        <field name="TEXT">print_html</field>
                                                      </shadow>
                                                      <block type="text_join" id="6v6#qb.#/6J4?k`9_nF!">
                                                        <mutation items="2"></mutation>
                                                        <value name="ADD0">
                                                          <block type="text" id="R!5(ZhN|#?d1R~:|B3vY">
                                                            <field name="TEXT">BLED PWM=</field>
                                                          </block>
                                                        </value>
                                                        <value name="ADD1">
                                                          <block type="variables_get" id="3jZwx.kibR+g=w!P?+nb">
                                                            <field name="VAR" id="*:})YLa%H%Hy=|)4xdb4" variabletype="">req</field>
                                                          </block>
                                                        </value>
                                                      </block>
                                                    </value>
                                                  </block>
                                                </next>
                                              </block>
                                            </next>
                                          </block>
                                        </next>
                                      </block>
                                    </statement>
                                    <next>
                                      <block type="simple_conditionesp" id="Z@59D)[5kG,$Bpx^*pn3">
                                        <value name="condition">
                                          <shadow type="text3" id="#UTt`CEVU9q]^z`.:;]C">
                                            <field name="TEXT">/TEMP</field>
                                          </shadow>
                                        </value>
                                        <statement name="NAME">
                                          <block type="simplewebserverprintesp" id="^zFLlT753G[cXV0h%|P/">
                                            <value name="print">
                                              <shadow type="text3" id="`vC#DdoRw4$~LSU=LjBG">
                                                <field name="TEXT">RLED=OFF</field>
                                              </shadow>
                                              <block type="get_temp" id="-U=}%pU@QpGyjQAXqLXc"></block>
                                            </value>
                                          </block>
                                        </statement>
                                        <next>
                                          <block type="simple_conditionesp" id="!0d9eX5N](*(_NpK.A5a">
                                            <value name="condition">
                                              <shadow type="text3" id="}tK%n=XX!B}2Q;#6c,:Z">
                                                <field name="TEXT">/PHOTOA</field>
                                              </shadow>
                                            </value>
                                            <statement name="NAME">
                                              <block type="simplewebserverprintesp" id="+Pf,CuvEUJ]/M][6MG:6">
                                                <value name="print">
                                                  <shadow type="text3" id="Ya`?rmI`6o6MB=7}H2fx">
                                                    <field name="TEXT">RLED=OFF</field>
                                                  </shadow>
                                                  <block type="checkLDR" id=":DjC#1p~V|7_DRNwlT0P">
                                                    <field name="pin">39</field>
                                                  </block>
                                                </value>
                                              </block>
                                            </statement>
                                            <next>
                                              <block type="simple_conditionesp" id="Pvm2gb3D@smUyjhK/sF4">
                                                <value name="condition">
                                                  <shadow type="text3" id="ML2T$u;keWB`q+o57c@_">
                                                    <field name="TEXT">/PHOTOB</field>
                                                  </shadow>
                                                </value>
                                                <statement name="NAME">
                                                  <block type="simplewebserverprintesp" id="WQl9Lw^g]Rn3eAq@,Gbg">
                                                    <value name="print">
                                                      <shadow type="text3" id="peB{LEWHLRDzA{WDS)Ky">
                                                        <field name="TEXT">RLED=OFF</field>
                                                      </shadow>
                                                      <block type="checkLDR" id="^(ZG6C-H1~m5B=7~U(6Q">
                                                        <field name="pin">36</field>
                                                      </block>
                                                    </value>
                                                  </block>
                                                </statement>
                                                <next>
                                                  <block type="simple_conditionesp" id="=T/}yR;-5i;1Vo_@xJ+1">
                                                    <value name="condition">
                                                      <shadow type="text3" id="z=kjkq|1C#H|Yv+vFqKy">
                                                        <field name="TEXT">/LED=1</field>
                                                      </shadow>
                                                    </value>
                                                    <statement name="NAME">
                                                      <block type="math_change" id="(KP6toSwazsf(mId(F!@">
                                                        <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                                        <value name="DELTA">
                                                          <shadow type="math_number" id="H%hBw3oyO6XG?8Osx2Gj">
                                                            <field name="NUM">30</field>
                                                          </shadow>
                                                        </value>
                                                        <next>
                                                          <block type="pocketled5" id="/OAe)#[RSZ]peI|1h/JD">
                                                            <value name="num2">
                                                              <shadow type="math_number" id="U::I%ns;Yp3B|W?uff4f">
                                                                <field name="NUM">0</field>
                                                              </shadow>
                                                              <block type="variables_get" id="KLH0qy=Jgec(!=ges:)%">
                                                                <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                                              </block>
                                                            </value>
                                                            <value name="num1">
                                                              <shadow type="math_number" id="[LkWmQGEIUn+h_d|61=k">
                                                                <field name="NUM">0</field>
                                                              </shadow>
                                                              <block type="variables_get" id="y,bA.a|hgh7Dv_^vqmEo">
                                                                <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                                              </block>
                                                            </value>
                                                            <value name="num3">
                                                              <shadow type="math_number" id="friFF+sj9XCZjM=+QlJU">
                                                                <field name="NUM">0</field>
                                                              </shadow>
                                                              <block type="variables_get" id="Wre$~b.-!w3jp~sfUROO">
                                                                <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                                              </block>
                                                            </value>
                                                            <next>
                                                              <block type="simplewebserverprintesp" id="|).7=*Ej.8DsH-kD^Q[1">
                                                                <value name="print">
                                                                  <shadow type="text3" id="plAj:QXDnG#_9$iYCV)`">
                                                                    <field name="TEXT">RLED=ON</field>
                                                                  </shadow>
                                                                </value>
                                                              </block>
                                                            </next>
                                                          </block>
                                                        </next>
                                                      </block>
                                                    </statement>
                                                    <next>
                                                      <block type="simple_conditionesp" id="^j8gsCu(o0:_;-/YwK!D">
                                                        <value name="condition">
                                                          <shadow type="text3" id="$=({:lnz2!w5#mKM%Qhf">
                                                            <field name="TEXT">/LED=2</field>
                                                          </shadow>
                                                        </value>
                                                        <statement name="NAME">
                                                          <block type="math_change" id=":G#X:s%31M7j9rKa?a7-">
                                                            <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                                            <value name="DELTA">
                                                              <shadow type="math_number" id="Yvc0iDig:7F._PM^oQR^">
                                                                <field name="NUM">0</field>
                                                              </shadow>
                                                            </value>
                                                            <next>
                                                              <block type="pocketled5" id=";e[m37E,Oc~gyl=d`}/E">
                                                                <value name="num2">
                                                                  <shadow type="math_number" id="U::I%ns;Yp3B|W?uff4f">
                                                                    <field name="NUM">0</field>
                                                                  </shadow>
                                                                  <block type="variables_get" id="W@MvJF-3pictRs!b_a!:">
                                                                    <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                                                  </block>
                                                                </value>
                                                                <value name="num1">
                                                                  <shadow type="math_number" id="[LkWmQGEIUn+h_d|61=k">
                                                                    <field name="NUM">0</field>
                                                                  </shadow>
                                                                  <block type="variables_get" id="X$XdP}Q,ThiL[Fu`xuiF">
                                                                    <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                                                  </block>
                                                                </value>
                                                                <value name="num3">
                                                                  <shadow type="math_number" id="friFF+sj9XCZjM=+QlJU">
                                                                    <field name="NUM">0</field>
                                                                  </shadow>
                                                                  <block type="variables_get" id="Ud}ysi+|I#[bt?x7)j#K">
                                                                    <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                                                  </block>
                                                                </value>
                                                                <next>
                                                                  <block type="simplewebserverprintesp" id="mOGwvf%?w3}Aueeu*Gu;">
                                                                    <value name="print">
                                                                      <shadow type="text3" id="n?Ud-`)EOM:}$.tc=)oQ">
                                                                        <field name="TEXT">RLED=OFF</field>
                                                                      </shadow>
                                                                    </value>
                                                                  </block>
                                                                </next>
                                                              </block>
                                                            </next>
                                                          </block>
                                                        </statement>
                                                        <next>
                                                          <block type="simple_conditionesp" id="Yq3g^s1=Q-G.,1_[8nB:">
                                                            <value name="condition">
                                                              <shadow type="text3" id="m}BwiFg2OI9qkx]EpIUB">
                                                                <field name="TEXT">/LED=3</field>
                                                              </shadow>
                                                            </value>
                                                            <statement name="NAME">
                                                              <block type="math_change" id="hw$%:)bo@[Fy_k$FH)a5">
                                                                <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                                                <value name="DELTA">
                                                                  <shadow type="math_number" id="fIn45d|;O*6Z6DG-bmw%">
                                                                    <field name="NUM">30</field>
                                                                  </shadow>
                                                                </value>
                                                                <next>
                                                                  <block type="pocketled5" id="iwnMnR72Oc4kj70_A#{D">
                                                                    <value name="num2">
                                                                      <shadow type="math_number" id="U::I%ns;Yp3B|W?uff4f">
                                                                        <field name="NUM">0</field>
                                                                      </shadow>
                                                                      <block type="variables_get" id="xsvp1AoA9FK(%q|)n[v*">
                                                                        <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                                                      </block>
                                                                    </value>
                                                                    <value name="num1">
                                                                      <shadow type="math_number" id="[LkWmQGEIUn+h_d|61=k">
                                                                        <field name="NUM">0</field>
                                                                      </shadow>
                                                                      <block type="variables_get" id="Tq=g:ohA$ndCK.eMRTlA">
                                                                        <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                                                      </block>
                                                                    </value>
                                                                    <value name="num3">
                                                                      <shadow type="math_number" id="friFF+sj9XCZjM=+QlJU">
                                                                        <field name="NUM">0</field>
                                                                      </shadow>
                                                                      <block type="variables_get" id="R3U}%z$L;q{jcam|*Fx3">
                                                                        <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                                                      </block>
                                                                    </value>
                                                                    <next>
                                                                      <block type="simplewebserverprintesp" id="6NK@+!M*9YmT%;cS19^C">
                                                                        <value name="print">
                                                                          <shadow type="text3" id="Y[l@A9T||xyrdvgW}Lly">
                                                                            <field name="TEXT">GLED=ON</field>
                                                                          </shadow>
                                                                        </value>
                                                                      </block>
                                                                    </next>
                                                                  </block>
                                                                </next>
                                                              </block>
                                                            </statement>
                                                            <next>
                                                              <block type="simple_conditionesp" id="5d)YQs-{;Z8yETKsuYLp">
                                                                <value name="condition">
                                                                  <shadow type="text3" id="e,!ER@=e*ZCb_vIHjlKJ">
                                                                    <field name="TEXT">/LED=4</field>
                                                                  </shadow>
                                                                </value>
                                                                <statement name="NAME">
                                                                  <block type="math_change" id="zh{wj]fd.WI1A[_1hfs]">
                                                                    <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                                                    <value name="DELTA">
                                                                      <shadow type="math_number" id="Y}IIYMdXgU!#/zk~N.z9">
                                                                        <field name="NUM">0</field>
                                                                      </shadow>
                                                                    </value>
                                                                    <next>
                                                                      <block type="pocketled5" id=".$13AI5oOyi8F(?^S8e4">
                                                                        <value name="num2">
                                                                          <shadow type="math_number" id="U::I%ns;Yp3B|W?uff4f">
                                                                            <field name="NUM">0</field>
                                                                          </shadow>
                                                                          <block type="variables_get" id="_@#|SR]HK$}`o9:GLbUN">
                                                                            <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                                                          </block>
                                                                        </value>
                                                                        <value name="num1">
                                                                          <shadow type="math_number" id="[LkWmQGEIUn+h_d|61=k">
                                                                            <field name="NUM">0</field>
                                                                          </shadow>
                                                                          <block type="variables_get" id="o~hA3wE~cu-=X}T7g_w?">
                                                                            <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                                                          </block>
                                                                        </value>
                                                                        <value name="num3">
                                                                          <shadow type="math_number" id="friFF+sj9XCZjM=+QlJU">
                                                                            <field name="NUM">0</field>
                                                                          </shadow>
                                                                          <block type="variables_get" id="FICxLrfoXVnWyjn9UhSH">
                                                                            <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                                                          </block>
                                                                        </value>
                                                                        <next>
                                                                          <block type="simplewebserverprintesp" id="`yIpY}u$b4tvwz]b*B}]">
                                                                            <value name="print">
                                                                              <shadow type="text3" id="Noq}:bt+/{hPi0yI!id}">
                                                                                <field name="TEXT">BGLED=OFF</field>
                                                                              </shadow>
                                                                            </value>
                                                                          </block>
                                                                        </next>
                                                                      </block>
                                                                    </next>
                                                                  </block>
                                                                </statement>
                                                                <next>
                                                                  <block type="simple_conditionesp" id="T`UL:#s9R6M6T2vn2O9U">
                                                                    <value name="condition">
                                                                      <shadow type="text3" id=":dZGS8`2kicD{?s@bEP.">
                                                                        <field name="TEXT">/LED=5</field>
                                                                      </shadow>
                                                                    </value>
                                                                    <statement name="NAME">
                                                                      <block type="math_change" id="p3z^8}a2K%RFxo5VoQk[">
                                                                        <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                                                        <value name="DELTA">
                                                                          <shadow type="math_number" id="VDV**^ul3~0T$RNr)l~c">
                                                                            <field name="NUM">30</field>
                                                                          </shadow>
                                                                        </value>
                                                                        <next>
                                                                          <block type="pocketled5" id="qH8:y]50y1M98_k6VrJO">
                                                                            <value name="num2">
                                                                              <shadow type="math_number" id="U::I%ns;Yp3B|W?uff4f">
                                                                                <field name="NUM">0</field>
                                                                              </shadow>
                                                                              <block type="variables_get" id="B{:tP`fQ?yWb!ezT5Z^^">
                                                                                <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                                                              </block>
                                                                            </value>
                                                                            <value name="num1">
                                                                              <shadow type="math_number" id="[LkWmQGEIUn+h_d|61=k">
                                                                                <field name="NUM">0</field>
                                                                              </shadow>
                                                                              <block type="variables_get" id="$pf[dYEWWHpIO0uPn%g~">
                                                                                <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                                                              </block>
                                                                            </value>
                                                                            <value name="num3">
                                                                              <shadow type="math_number" id="friFF+sj9XCZjM=+QlJU">
                                                                                <field name="NUM">0</field>
                                                                              </shadow>
                                                                              <block type="variables_get" id="/_;kSUQ$0UC{Ibk1GksK">
                                                                                <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                                                              </block>
                                                                            </value>
                                                                            <next>
                                                                              <block type="simplewebserverprintesp" id="3Z~hPb]LKK9j;{(Fgsb@">
                                                                                <value name="print">
                                                                                  <shadow type="text3" id="azbts,aJdxRc^g;MO;d|">
                                                                                    <field name="TEXT">BLED=ON</field>
                                                                                  </shadow>
                                                                                </value>
                                                                              </block>
                                                                            </next>
                                                                          </block>
                                                                        </next>
                                                                      </block>
                                                                    </statement>
                                                                    <next>
                                                                      <block type="simple_conditionesp" id="O@*0!]pF*TUY4T%M+{E)">
                                                                        <value name="condition">
                                                                          <shadow type="text3" id=")l#H%0LB1~E:6a@k;9fV">
                                                                            <field name="TEXT">/LED=6</field>
                                                                          </shadow>
                                                                        </value>
                                                                        <statement name="NAME">
                                                                          <block type="math_change" id="TxS^h=QryPPc49qPE7hY">
                                                                            <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                                                            <value name="DELTA">
                                                                              <shadow type="math_number" id="L$/qq^e|jm#6sU#jrNMq">
                                                                                <field name="NUM">0</field>
                                                                              </shadow>
                                                                            </value>
                                                                            <next>
                                                                              <block type="pocketled5" id="ZtifP{D:Y*5|[=~ore1h">
                                                                                <value name="num2">
                                                                                  <shadow type="math_number" id="U::I%ns;Yp3B|W?uff4f">
                                                                                    <field name="NUM">0</field>
                                                                                  </shadow>
                                                                                  <block type="variables_get" id="n%;8/_x!v-7aCUod5UW1">
                                                                                    <field name="VAR" id=",{^YR5]O!g4=GEZ9Es9Y" variabletype="">RLED</field>
                                                                                  </block>
                                                                                </value>
                                                                                <value name="num1">
                                                                                  <shadow type="math_number" id="[LkWmQGEIUn+h_d|61=k">
                                                                                    <field name="NUM">0</field>
                                                                                  </shadow>
                                                                                  <block type="variables_get" id="1@Pc]m`(nsQOK-60`RRM">
                                                                                    <field name="VAR" id="2B|tVwg`2lg$j|LV=vT4" variabletype="">GLED</field>
                                                                                  </block>
                                                                                </value>
                                                                                <value name="num3">
                                                                                  <shadow type="math_number" id="friFF+sj9XCZjM=+QlJU">
                                                                                    <field name="NUM">0</field>
                                                                                  </shadow>
                                                                                  <block type="variables_get" id="nF$+Xh;)AYD9@3OO;w=s">
                                                                                    <field name="VAR" id="pq[`/E]Yx|29J2OWpY^V" variabletype="">BLED</field>
                                                                                  </block>
                                                                                </value>
                                                                                <next>
                                                                                  <block type="simplewebserverprintesp" id="zu(_e(4kD/4%f}j+XNO~">
                                                                                    <value name="print">
                                                                                      <shadow type="text3" id="7^SprFrf!g::5CY3G%J2">
                                                                                        <field name="TEXT">BLED=OFF</field>
                                                                                      </shadow>
                                                                                    </value>
                                                                                  </block>
                                                                                </next>
                                                                              </block>
                                                                            </next>
                                                                          </block>
                                                                        </statement>
                                                                        <next>
                                                                          <block type="simplenoconnectesp" id="l/nR5IF5}2K[#STUW$U-"></block>
                                                                        </next>
                                                                      </block>
                                                                    </next>
                                                                  </block>
                                                                </next>
                                                              </block>
                                                            </next>
                                                          </block>
                                                        </next>
                                                      </block>
                                                    </next>
                                                  </block>
                                                </next>
                                              </block>
                                            </next>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>